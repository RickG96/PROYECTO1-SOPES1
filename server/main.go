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

type Cpuhijo struct {
    Pid int `json:"pid"`
    Name string `json:"name"`
    State int `json:"state"`
}

type Cpu struct {
    Pid int `json:"pid"`
    Name string `json:"name"`
    State int `json:"state"`
    Uid int `json:"uid"`
    User string `json:"user"`
    Hijo []Cpuhijo `json:"childs"`
}

type Percentage struct {
    Per float64 `json:"percentage"`
}

func getUidUserName(uid int) string {
    if uid == 0 {
        return "root"
    } else if uid == 1000 {
        return "runi"
    } else {
        command := fmt.Sprintf("getent passwd %d | cut -d: -f1", uid) 

        cmd := exec.Command("sh", "-c", command)

        out, err := cmd.CombinedOutput()

        if err != nil {
            log.Fatal(err)
        }

        output := string(out[:])

        output = strings.Replace(output, "\n", "", -1)

        //intCache, err := strconv.Atoi(output)
        return output
    }
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

func returnCpuUsage(w http.ResponseWriter, r *http.Request) {
    w.Header().Set("Content-Type", "text/html; charset=ascii")
    w.Header().Set("Access-Control-Allow-Origin", "*")
    w.Header().Set("Access-Control-Allow-Headers","Content-Type,access-control-allow-origin, access-control-allow-headers")

    fmt.Println("Request Cpu usage...")

    cmd := exec.Command("sh", "-c", "ps -eo pcpu | sort -k 1 -r | head -70")
    
    out, err := cmd.CombinedOutput()

    if err != nil {
        log.Fatal(err)
    }

    output := string(out[:])

    percentages := strings.Fields(output);

    const bitSize = 64

    var total float64 = 0

    for index, element := range percentages {
        if index != 0 {
            
            f, err := strconv.ParseFloat(element, 8)

            if err != nil {
                log.Fatal(err)
            }

            total += f
        }
    }

    data := Percentage{}

    data.Per = total

    //fmt.Println(getUidUserName(1000))
    fmt.Println(total)
    json.NewEncoder(w).Encode(data)
}

func killProcess(w http.ResponseWriter, r *http.Request) {
    w.Header().Set("Content-Type", "text/html; charset=ascii")
    w.Header().Set("Access-Control-Allow-Origin", "*")
    w.Header().Set("Access-Control-Allow-Headers","Content-Type,access-control-allow-origin, access-control-allow-headers")

    fmt.Println("Request kill process...")

    query := r.URL.Query()
    idProcess := query.Get("id") 

    cmd := exec.Command("sh", "-c", "kill -9 " + idProcess)
    out, err := cmd.CombinedOutput()

    if err != nil {
        log.Fatal(err)
    }

    output := string(out[:])



    fmt.Fprintf(w,idProcess)
    fmt.Println(idProcess + output)
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

    data.Totalram += data.Sharedram + 200

    data.Usageram = 0;

    data.Usageram = data.Totalram - data.Freeram - cache

    //data.Freeram = data.Totalram - data.Usageram

    data.Usagepercentage = (data.Usageram * 100) / data.Totalram
    

    //fmt.Println(data)

    json.NewEncoder(w).Encode(data)
}

func returnCpuInfo(w http.ResponseWriter, r *http.Request) {
    w.Header().Set("Content-Type", "text/html; charset=ascii")
    w.Header().Set("Access-Control-Allow-Origin", "*")
    w.Header().Set("Access-Control-Allow-Headers","Content-Type,access-control-allow-origin, access-control-allow-headers")

    fmt.Println("Request modulo Cpu...")

    cmd := exec.Command("sh", "-c", "cat /proc/cpu_201603157")
    out, err := cmd.CombinedOutput()

    if err != nil {
        log.Fatal(err)
    }
    
    output := string(out[:])

    //fmt.Println(output)

    data := []Cpu{}
    
    json.Unmarshal([]byte(output), &data)

    for i := 0; i < len(data); i++ {
        attr := &data[i]
        attr.User = getUidUserName(attr.Uid)
        //fmt.Println(element.User)
    }

    json.NewEncoder(w).Encode(data)
}

func handleRequests() {

    //myRouter := mux.NewRouter().StrictSlash(true)

    //http.HandleFunc("/", homePage)
    http.HandleFunc("/modulo_ram", returnRamInfo)
    http.HandleFunc("/modulo_cpu", returnCpuInfo)
    http.HandleFunc("/kill_process", killProcess)
    http.HandleFunc("/cpu_usage", returnCpuUsage)

    log.Fatal(http.ListenAndServe(":10000", nil))
}

func main() {
    fmt.Println("Iniciando servidor...")
    
    handleRequests()
}