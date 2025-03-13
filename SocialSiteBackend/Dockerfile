# Stage 1: Build and install dependencies
FROM python:3.11-alpine AS build

# Set the working directory
WORKDIR /app

# Install system dependencies
RUN apk add --no-cache --virtual .build-deps gcc musl-dev libffi-dev

# Install python dependencies
COPY requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt

# Ensure the PATH includes the virtual environment
ENV PATH="/opt/venv/bin:$PATH"


# Copy the Django project files into the container
COPY . /app/

# Expose the backend port (optional, defaults to 8000 for Django)
EXPOSE 8000

# Command to run the backend server
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
