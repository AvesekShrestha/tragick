from faker import Faker
import psycopg2
import uuid
import random

your_database = "supplychain"
your_user = "postgres"
your_password = "admin"
your_host = "localhost"
your_port = "5432"

conn = psycopg2.connect(
    database=your_database,
    user=your_user,
    password=your_password,
    host=your_host,
    port=your_port
)
cursor = conn.cursor()

fake = Faker()

for _ in range(200):
    username = fake.user_name()
    email = fake.email()
    first_name = fake.first_name()
    last_name = fake.last_name()
    vendor_name = fake.company()
    location_lat = round(random.uniform(27.644, 27.769), 6)  # Latitude within Kathmandu Valley
    location_long = round(random.uniform(85.213, 85.379), 6)  # Longitude within Kathmandu Valley

    id = str(uuid.uuid4()).replace("-", "")[:32]  # Generate a unique ID

    cursor.execute("""
        INSERT INTO public.accounts_vendor 
        (password, last_login, is_superuser, username, is_staff, is_active, date_joined, id, email, first_name, last_name, vendor_name, location_lat, location_long) 
        VALUES (%s, NULL, %s, %s, %s, %s, NOW(), %s, %s, %s, %s, %s, %s, %s)
    """, (
        "password_hash",  
        False,  
        username,
        False,
        True,
        id,
        email,
        first_name,
        last_name,
        vendor_name,
        location_lat,
        location_long
    ))


conn.commit()
cursor.close()
conn.close()

