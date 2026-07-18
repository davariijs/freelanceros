FROM node:19-alpine
WORKDIR /app
COPY . .
RUN npm install -g pnpm && pnpm install --frozen-lockfile
RUN pnpm --filter @freelanceos/database db:generate
RUN pnpm --filter @freelanceos/database build
RUN pnpm --filter @freelanceos/api build
EXPOSE 3000
CMD ["pnpm", "--filter", "@freelanceos/api", "start"]