# Start from the official Golang image for building
FROM golang:latest AS builder

WORKDIR /app

# Copy go mod and sum files
COPY go.mod go.sum ./
RUN go mod download

# Copy the source code
COPY . .

# Build the Go server
RUN go build -o server .

# Use a minimal image for running
FROM alpine:latest

WORKDIR /app

# Copy the built binary from the builder
COPY --from=builder /app/server .

# Expose port (change 8080 if your server uses a different port)
EXPOSE 8080

# Run the Go server
CMD ["./server"]