# PairProject_Ecommerce
Pair Project Hacktiv8 Phase 1
Overview
Setiap Team Pair Project akan mendapatkan tema challenge yang ditentukan oleh instruktur.
Silakan tanyakan kepada buddy instruktur bila kamu belum mendapat tema challenge.
Requirement Level Database

1. Schema Table
2. Terdapat entitas wajib yaitu users dengan attribute yang harus ada:
    a. email
    b. password
    c. role
3. Memiliki 3 jenis asosiasi yang berbeda:
    a. One to One (wajib)
    b. One to Many
    c. Many to Many

4. Membuat migration
5. Membuat migration tambahan (add column, dll)
6. Membuat seeder

Requirement Routes
1. Minimal terdapat 2 route GET dan 1 route POST
2. Terdapat route untuk logout

Requirement Aplikasi
1. Terdapat fitur search atau sort (menggunakan OP dari sequelize)
2. Terdapat static method dan instance method
3. Menggunakan berbagai macam validasi dari sequelize dan mengolahnya sehingga tampil pada page
4. Menggunakan method-method sequelize yang bertujuan untuk CRUD
5. Terdapat hooks.
6. Membuat dan menggunakan helper
7. Menggunakan mekanisme double promise dalam satu controller

Requirement Pages
1. Landing page (menggambarkan project)
2. Register & login page
3. Memiliki 1 page yang menampil data gabungan dari 2 table atau lebih (gunakan eager loading dari sequelize)

Requirement Explore
1. Membuat sistem login dengan middleware, session & bcryptjs
2. Membuat fitur MVP (fitur unik dengan menggunakan package yang belum pernah dibahas saat lecture)

Tema
Ecommerce Toko (Contoh tokopedia, shopee)

a. Products (entitas utama)

    1. Id
    2. name:string (validation: required)
    3. description:string (validation: required)
    4. price:integer (validation: required, min price (bebas))
    5. categoryld
    6. userld
    7. createdAt: date
    8. updatedAt: date

B. Categories

    1. Id
    2. name: string (validation: required)
    3. createdAt: date
    4. updatedAt: date