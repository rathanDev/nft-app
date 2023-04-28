package main

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/gin-contrib/cors"

	_ "github.com/go-sql-driver/mysql"

	"crypto/rand"
	"database/sql"
	"encoding/hex"
	"log"
)

type RegisterRequest struct {
	NRIC          string `json:"nric"`
	WalletAddress string `json:"walletAddress"`
}

type RegisterResponse struct {
	Receipt string `json:"receipt"`
}

type DatabaseConfig struct {
	Host     string
	Port     string
	User     string
	Password string
	Name     string
}

type Registration struct {
	Id            int    `json:"id"`
	Nric          string `json:"nric"`
	WalletAddress string `json:"wallet_address"`
}

var db *sql.DB

func handleRegister(c *gin.Context) {
	fmt.Println("Inside handleRegister")

	var req RegisterRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	fmt.Println("Req:", req)

	if !isNRICUnique(req.NRIC) {
		c.JSON(http.StatusConflict, gin.H{"error": "NRIC already exists"})
		return
	}
	fmt.Println("NRIC Unique")

	if !isWalletUnique(req.WalletAddress) {
		c.JSON(http.StatusConflict, gin.H{"error": "Wallet address already associated with another NRIC"})
		return
	}
	fmt.Println("Wallet Unique")

	receiptHash := make([]byte, 32)
	_, err := rand.Read(receiptHash)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate receipt hash"})
		return
	}
	receipt := hex.EncodeToString(receiptHash)

	reg := Registration{Nric: req.NRIC, WalletAddress: req.WalletAddress}
	// reg := Registration{Nric: "someNric", WalletAddress: req.WalletAddress}
	addRegistration(reg)

	res := RegisterResponse{Receipt: receipt}
	c.JSON(http.StatusOK, res)
}

func addRegistration(reg Registration) (int64, error) {
	fmt.Println("AddRegistration", reg)
	result, err := db.Exec("INSERT INTO registration (nric, wallet_address) VALUES (?, ?)", reg.Nric, reg.WalletAddress)
	if err != nil {
		return 0, fmt.Errorf("addReg: %v", err)
	}
	id, err := result.LastInsertId()
	if err != nil {
		return 0, fmt.Errorf("addReg: %v", err)
	}
	return id, nil
}

func isNRICUnique(nric string) bool {
	var count int
	fmt.Println("NRIC->", nric)
	err := db.QueryRow("SELECT COUNT(*) FROM registration where nric = ?", nric).Scan(&count)
	if err != nil {
		fmt.Println("Err at finding nric")
		log.Fatal(err)
	}
	fmt.Println("NRIC Count:", count)
	return count == 0
}

func isWalletUnique(walletAddress string) bool {
	var count int
	fmt.Println("WalletAddress:", walletAddress)
	err := db.QueryRow("SELECT COUNT(*) FROM registration where wallet_address = ?", walletAddress).Scan(&count)
	if err != nil {
		fmt.Println("Err at finding walletAddress")
		log.Fatal(err)
	}
	fmt.Println("WalletAddress Count:", count)
	return count == 0
}

func initDb() {
	connection, err := sql.Open("mysql", "myuser:mypassword@tcp(127.0.0.1:3306)/mydb")
	if err != nil {
		panic(err.Error())
	}
	db = connection
	fmt.Println("InitDb ", db)
}

func main() {
	initDb()
	router := gin.Default()

	config := cors.DefaultConfig()
    config.AllowAllOrigins = true
    config.AllowMethods = []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"}
    config.AllowHeaders = []string{"Authorization", "Content-Type"}

    router.Use(cors.New(config))

	router.POST("/register", handleRegister)

	router.Run(":8080")
}
