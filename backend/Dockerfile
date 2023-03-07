FROM python:3.7.16

WORKDIR /app

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .

EXPOSE 8080
ENTRYPOINT ["python3", "server.py"]
