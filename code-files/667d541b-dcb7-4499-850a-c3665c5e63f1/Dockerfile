FROM node:16-alpine
WORKDIR /app
COPY . .
RUN npm init -y && npm install express
RUN echo 'const express = require("express");\nconst app = express();\nconst port = process.env.PORT || 8080;\napp.use(express.static("."));\nconst mainCode = require("./main.js");\nif (typeof mainCode === "function") {\n  app.get("/api", (req, res) => res.json(mainCode(req.query)));\n}\napp.listen(port, () => console.log("Server running on port " + port));' > server.js
CMD ["node", "server.js"]