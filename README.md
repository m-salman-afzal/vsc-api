# vs-corrections-api

Viral Solution Corrections Api. In this project fchc/FCH/FCHC/corrections have same meaning.

### **Getting Started**

-   Run following commands to start:

```
npm i
npx husky install
```

-   Checkout `.env.example` on how to setup `.env` file.

-   Install mkcert and make certificates

```
npm install -g mkcert

mkcert create-ca

mkcert create-cert
```

<br/>

### **Linting/Formatting**

The project follows the linting guidelines for **eslint**. Most of the rules regarding formatting are catered with
**prettier**. Most of the linting problems described in eslint can be solved by eslint on its own. In VSCode, you can
configure to run eslint on save. Then, you can run prettier formatter to acheive linting and formatting. If you are
running anyother code editor, you can run

```
npx eslint --fix <filename>
npx prettier --write <filename>
```

In case of prettier, you can also provide a dot(.) in filename to run it on whole directory.

<br/>

### **Before Commit**

Husky does not let you commit your code unless you lint and format which you can do as above. You can checkout husky
[here](https://typicode.github.io/husky/#/). **It should be noted the linting and formatting is not done automatically,
it is only checked.** So, you can either use your editor to do so, or do it manually through commands.

When you are on windows, you might get error while comming that husky command is not valid. This is because, `husky.sh`
has default file line ending set to LF and windows has default line ending CRLF. So you might need to change the line
ending before committing. On Linux, since line ending is LF by default, so it should not cause problems.

<br/>

### **TODO**

-   Update documentation
