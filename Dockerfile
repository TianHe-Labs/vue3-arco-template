# FROM node:20-alpine as build-stage
# WORKDIR /app
# RUN npm set registry https://registry.npmmirror.com && npm install -g pnpm
# COPY pnpm-lock.yaml package.json ./
# RUN pnpm install
# COPY . .
# RUN pnpm run build

# ,${STS_URL},${MEDIA_URL}
FROM nginx:stable-alpine as deploy-stage
# COPY --from=build-stage /app/dist /usr/share/nginx/html
COPY ./dist/ /usr/share/nginx/html
COPY docker.nginx.template /etc/nginx/conf.d/docker.nginx.template
CMD envsubst '${API_URL}' < /etc/nginx/conf.d/docker.nginx.template > /etc/nginx/conf.d/default.conf && exec nginx -g 'daemon off;'
