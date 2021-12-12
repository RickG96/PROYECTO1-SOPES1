package main

import (
	"fmt"
	"log"
	"net/http"
    "os/exec"
    "encoding/json"
    //"reflect"
    "strconv"
    "strings"
    //"github.com/gorilla/mux"
)

type Ram struct {
    Totalram int `json:"totalRam"`
    Freeram int `json:"freeRam"`
    Usageram int `json:"usageRam"`
    Usagepercentage int `json:"usagePercentage"`
    Sharedram int `json:"sharedRam"`
}

func getMemoryCache() int {
    cmd := exec.Command("sh", "-c", "free -m | head --line=2 | tail --line=1 | awk '{print $6}'")
    
    out, err := cmd.CombinedOutput()

    if err != nil {
        log.Fatal(err)
    }

    output := string(out[:])

    output = strings.Replace(output, "\n", "", -1)

    intCache, err := strconv.Atoi(output)

    fmt.Println(intCache)

    return intCache
}

func homePage(w http.ResponseWriter, r *http.Request){
    fmt.Fprintf(w, "Welcome to the HomePage!")
    fmt.Println("Endpoint Hit: homePage")
}

func returnRamInfo(w http.ResponseWriter, r *http.Request) {
    w.Header().Set("Content-Type", "text/html; charset=ascii")
    w.Header().Set("Access-Control-Allow-Origin", "*")
    w.Header().Set("Access-Control-Allow-Headers","Content-Type,access-control-allow-origin, access-control-allow-headers")

    fmt.Println("Request modulo ram...")

    cmd := exec.Command("sh", "-c", "cat /proc/memo_201603157")
    out, err := cmd.CombinedOutput()

    if err != nil {
        log.Fatal(err)
    }
    
    output := string(out[:])

    //fmt.Println(output)

    data := Ram{}
    
    json.Unmarshal([]byte(output), &data)

    var cache int = getMemoryCache()

    data.Totalram += data.Sharedram

    data.Usageram = 0;

    data.Usageram = data.Totalram - data.Freeram - cache

    //data.Freeram = data.Totalram - data.Usageram

    data.Usagepercentage = (data.Usageram * 100) / data.Totalram
    

    //fmt.Println(data)

    json.NewEncoder(w).Encode(data)
}

func handleRequests() {

    //myRouter := mux.NewRouter().StrictSlash(true)

    //http.HandleFunc("/", homePage)
    http.HandleFunc("/modulo_ram", returnRamInfo)

    log.Fatal(http.ListenAndServe(":10000", nil))
}

func main() {
    fmt.Println("Iniciando servidor...")
    
    handleRequests()
}