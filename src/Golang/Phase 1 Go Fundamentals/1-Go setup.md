- Go kya hai, philosophy aur design goals
- `go run`
- `go build`
- `go install`
- Go workspace
- Go Modules
- `go.mod`
- `go.sum`
- Packages
- `package main`
- `func main()`
- Imports
- Exported vs unexported identifiers
- Formatting with `gofmt`

---


### Go kya hai, philosophy aur design goals ?

Go Ek statically typed programing language jo google main banayi gayi thi , 
is ka simple focus large_scale Softaware ko  Simple , fast our maintainable  tareeqe develop karna tha.

Go ki philosophy ko basically 3 lafzon mein pakar sakte hain

> **Simplicity + Readability + Productivity**

### Philosophy

Go ke designers ka idea ye tha ke programming language itni complicated na ho ke developer ka dimagh language ke features samajhne mein lag jaye.

Example ke taur par Go mein traditional:

- class inheritance nahi
- operator overloading nahi
- exceptions nahi
- unnecessary language magic kam se kam

Yani Go ka attitude hai:

> **Jo cheez simple tareeqe se ho sakti hai, uske liye complicated machinery kyun banayein?**

---

## `go run`

Ye **program ko compile karke foran run** karta hai.

```bash
  go run main.go
```


## `go build`

Ye program ko **compile karke executable binary banata hai**.

```bash
 go build
```

Phir Linux par tumhare folder mein executable aa jata hai us ko simple ham run kar skte hain 

## `go install`

Ye bhi compile karta hai, **lekin executable ko Go ke installed binary location mein install karta hai**.

```bash
 go install
```

Ya kisi package ko:

```bash
 go install example.com/tool@latest
```

---
### Go Workspace kya hai?

Go workspace woh environment/directory structure hai jahan Go Hamare projects, packages aur dependencies ke saath kaam karta hai.

Lekin yahan ek important twist hai: **modern Go mein "workspace" ka matlab context ke hisaab se do cheezein ho sakta hai.**

### 1. Purana Go workspace model

Old Go ecosystem mein workspace ka central concept **`GOPATH`** tha.

Uske andar roughly:

```bash
GOPATH/
├── src/
├── pkg/
└── bin/
```

Yahan:

- `src` → Go source code
- `pkg` → compiled package data
- `bin` → installed executables

Ye purana model tha.

### 2. Modern Go

Aaj kal jab hum Go project banate hain, normally project apni **directory** mein hota hai aur **Go Modules** use karta hai:

```bash
my-project/
├── go.mod
├── go.sum
└── main.go
```

Isliye aaj ke Go development mein hamein project ko zaroori nahi ke `GOPATH/src` ke andar rakhna pade.

Hum kahin bhi project bana sakte ho:

```bash
mkdir my-project
cd my-project
go mod init my-project
```

Aur ye proper Go project ban Jata hai.

---

### Go Modules kya hain?

**Go Modules Go ka modern dependency management system hai.**

Go Module hamare Go project ko ek independent unit bana deta hai, jiske andar project ki identity aur uski dependencies track hoti hain.

Pehle `GOPATH` ke zamane mein project ko ek specific workspace structure follow karna padta tha.

ab yeh command se :

```bash
go mod init my-api
```

hamara project mein **`go.mod`** create Ho jati hai.

### `go.mod` kya hai?

`go.mod` hamare **Go Module ki main configuration file** hai.

jab ham:

```bash
go mod init github.com/jani/my-api
```

karte hain, Go hamare project ke andar:
``` bash
go.mod
```

file bana deta hai.

```go 
module github.com/jani/my-api

go 1.24
```

### Is mein kya hota hai?

Sab se basic level par `go.mod` Go ko batata hai:

**1. Module ka naam/path kya hai**

```go 
module github.com/jani/my-api
```

yani hamare Module ki identity.

**2. Kaunsi Go language/toolchain version ke context mein module hai**

```go
go 1.24
```

### Dependencies bhi yahin declare ho sakti hain

Agar project kisi external package ko use karta hai, `go.mod` mein uski required version aa sakti hai:

```go
require github.com/some/package v1.2.3
```

Yani Go ko pata hai:

```bash
Mera project
   ↓
requires
   ↓
some/package v1.2.3
```

---
### `go.sum` kya hai?

`go.sum` Go project ki **dependency verification file** hai.

Agar `go.mod` ye batata hai:

> "Mujhe ye dependency chahiye."

Toh `go.sum` basically ye ensure karne mein help karta hai:

> **"Jo dependency mujhe mili hai, woh wahi exact content hai jiske saath pehle verify kiya gaya tha."**

### Example

 hamare project mein:

```bash
my-api/
├── go.mod
├── go.sum
└── main.go
```

`go.mod`:

```go
require github.com/example/foo v1.2.3
```

Aur `go.sum` mein us dependency ke cryptographic checksums hote hain:

```bash
github.com/example/foo v1.2.3 h1:...
github.com/example/foo v1.2.3/go.mod h1:...
```

Ye `h1:...` values **checksums** hain.

### Ye kyun zaroori hai? 🔐

Suppose hamari dependency:

```bash
foo v1.2.3
```

Aaj Go ne uska content download kiya aur uska checksum record kar liya.

Kal dobara dependency fetch hoti hai, Go checksum verify kar sakta hai.

Agar content expected checksum se match nahi karta, Go ko pata chal sakta hai ke:

```bash
Expected  → X
Received  → Y
```

Kuch gadbad hai.

Yani `go.sum` dependency integrity ko verify karne mein help karta hai.

## Packages kya hain?

Go mein **package related Go code ka ek logical group hota hai**.

Sab se simple definition:

> **Package = related `.go` files/code ko organize karne ka unit.**

Go mein har `.go` file ke top par package declaration hoti hai:

```go
package main
```

Ya:

```go
package users
```


### Example

Maan lo project:

```bash
my-api/
├── main.go
└── users/
    ├── user.go
    └── validation.go
```

`users/user.go`:
```go
package users
```

`users/validation.go`:

```go
package users
```

Yahan:

```bash
users/
├── user.go
└── validation.go
```

dono **same package `users`** ka hissa hain.

Yani package zaroori nahi ke **ek file** ho.
Ek package mein multiple `.go` files ho sakti hain.

### Package ka purpose kya hai?

Sab se important kaam:

**Code ko organize aur isolate karna.**

Tumhare backend mein maan lo:

```bash
my-api/
├── main.go
├── users/
├── auth/
├── database/
└── email/
```

Toh tum related functionality ko separate packages mein rakh sakte ho:

```bash
users   → users se related code
auth    → authentication
database → database logic
email   → email logic
```

### Package aur Module same nahi hain

Ye bohat important hai:

```bash
Module
   ↓
poora project / module

Package
   ↓
module ke andar code ka logical unit
```

---


## `package main` kya hai?

`package main` Go ka **special package** hai jo batata hai:

> **"Ye package ek executable program banane ke liye hai."**

Example:

```go
package main

import "fmt"

func main() {
    fmt.Println("Hello Go")
}
```

Yahan:

```go
package main
```

Go compiler ko batata hai ke ye code **executable program** ka part hai.

---

## `func main()` kya hai?

`func main()` Go program ka **entry point** hai.

Yani jab tumhara executable program start hota hai, Go execution **`main()` function se shuru karta hai**.

Example:

```go
package main

import "fmt"

func main() {
    fmt.Println("Hello Go")
}
```

Yahan:

```go
func main()
```

ka matlab hai:

> **`main` naam ka function.**

Aur kyunke ye `package main` ke andar hai, Go ise program ka **starting point** samajhta hai.

---


## `import` kya hai?

Go mein `import` ka use **kisi doosre package ko apne current package mein use karne ke liye** hota hai.

Example:

```go
package main

import "fmt"

func main() {
    fmt.Println("Hello Go")
}
```

Yahan:

```go
import "fmt"
```

ka matlab:

> "Mujhe `fmt` package ki functionality apne code mein use karni hai."

---

## Identifier kya hota hai?

Identifier basically kisi cheez ka naam:

```go
name
Println
User
calculateTotal
```

Function, variable, type, constant waghera ke names identifiers hain.

Ab Go kehta hai:

### Capital letter se start → Exported

```go
func Hello() {
}
```

`Hello` **exported** hai.

Matlab doosre package isko access kar sakte hain.

Example:

```go
fmt.Println("Hello")
```

Yahan `Println` ka `P` capital hai, isliye ye `fmt` package se bahar accessible hai.

---

### Small letter se start → Unexported

```go
func hello() {
}
```

`hello` **unexported** hai.

Matlab ye sirf **usi package ke andar** accessible hai.

---

## `gofmt` kya hai?

`gofmt` Go ka **official code formatter** hai.

Iska kaam tumhare Go code ko Go ki **standard formatting style** mein automatically format karna hai.

Yani tum manually spaces, tabs, indentation waghera set karne ki tension nahi lete.

### Example

hum code aise likh dein:

```go
package main
import "fmt"
func main(){fmt.Println("Hello")}
```

Technically humne formatting ko barbaad kar diya 😂

Ab:

```bash
gofmt -w main.go
```

chalaya.

`gofmt` usko automatically:

```go
package main

import "fmt"

func main() {
	fmt.Println("Hello")
}
```

### `-w` kya hai?

Ye important hai:

```bash
gofmt -w main.go
```


`-w` ka matlab hai:

> **formatted result ko file mein write kar do.**

Agar sirf:

```bash
gofmt main.go
```

chalao, toh formatted code **terminal mein output** ho sakta hai, lekin original file modify nahi hoti.
