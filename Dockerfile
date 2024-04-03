# 使用 satantime/puppeteer-node 作为基础镜像
FROM satantime/puppeteer-node:20.11-buster-slim

# 设置环境变量
ENV PORT=3000
ENV NODE_ENV=production

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

# 根据 NODE_ENV 环境变量决定启动方式
CMD ["sh", "-c", "if [ \"$NODE_ENV\" = 'production' ]; then npm start; else npm run dev; fi"]
