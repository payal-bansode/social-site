# Stage 2: Serve the React app with NGINX
FROM nginx:alpine

WORKDIR /app

# Copy custom NGINX configuration file from the parent directory
COPY nginx.conf /etc/nginx/nginx.conf 


# Copy the React build output to NGINX's HTML directory
COPY dist /usr/share/nginx/html


# Set the correct permissions for NGINX to access files
RUN chown -R nginx:nginx /usr/share/nginx/html
RUN chmod -R 755 /usr/share/nginx/html



# Set the correct ownership for other NGINX critical files
RUN chown -R nginx:nginx /var/cache/nginx /var/log/nginx /etc/nginx/conf.d


# Expose port 80
EXPOSE 80


