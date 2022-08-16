const express = require('express');
const bodyParser = require('body-parser');
const koneksi = require('./config/database');
const app = express();
const PORT = process.env.PORT || 5000;
// set body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


app.route('/')
    .get(function (req, res) {
        res.render("../views/home.ejs")
    })



///////////////////////////////////////////////////
// read data / get data
app.get('/products', (req, res) => {
    // buat query sql
    const querySql = 'SELECT * FROM products';

    // jalankan query
    koneksi.query(querySql, (err, rows, field) => {
        // error handling
        if (err) {
            return res.status(500).json({ message: 'Ada kesalahan', error: err });
        }

        // jika request berhasil
        res.status(200).json({ success: true, data: rows });
    });
});


//tambah products
app.route('/tambah_products')
.get((req, res) => {
    res.render("../views/add_products.ejs")
})

.post(async (req, res) => {
    const { nama_barang, banyak_barang } = req.body
    const result = koneksi.query(`INSERT INTO products(nama,qty)VALUES('${nama_barang}','${banyak_barang}')`, function(error, result, field){
        console.log(result);
        if(result.affectedRows > 0){
            res.json({
                success:true
            })
        }else{
            res.json({
                success:false
            })
        }
    })
})

//delete products
app.route('/delete_products/:id')
.delete(async function (req, res) {
    const { id } = req.params
    const result = koneksi.query(`DELETE FROM products WHERE id=?`,id, function(error, result, field){
        if (error) {
            return res.status(500).json({ message: 'Ada kesalahan', error: error });
        }
        console.log(result);
        if(result.affectedRows > 0){
            res.json({
                success:true
            })
        }else{
            res.json({
                success:false
            })
        }
    })
})

//edit products
  app.route('/edit_barang')
    .get(function (req, res) {
        const { id, name, mapel } = req.query
        res.render('../views/edit_barang.ejs', {
            id: id,
            nama_barang: name,
            banyak_barang: mapel
        })
    })
    .post(async function (req, res) {
        const { id, nama_barang, banyak_barang } = req.body
        const result = koneksi.query(`UPDATE products SET nama='${nama_barang}', qty='${banyak_barang}' WHERE id='${id}'`, function(error, result, field){

            console.log(result);
            if(result.affectedRows > 0){
                res.json({
                    success:true
                })
            }else{
                res.json({
                    success:false
                })
            }
        })
    })


// buat server nya
app.listen(PORT, () => console.log(`Server running at port: ${PORT}`));
