# 使用 satantime/puppeteer-node 作为基础镜像
FROM satantime/puppeteer-node:20.11-buster-slim

# 设置工作目录
WORKDIR /app

# 将 package.json 和 package-lock.json 复制到工作目录
COPY package*.json ./

# 安装项目依赖
RUN npm install

# 将项目文件复制到工作目录
COPY . .

# 暴露端口
EXPOSE $PORT

# 设置环境变量
ENV PORT=3000
ENV BASE_URL=http://localhost:3000

# 运行 app.js
CMD ["node", "server.js"]
