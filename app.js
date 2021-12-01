const { urlencoded } = require('express')
const express = require('express')
const mongoose = require('mongoose')
const app = express()

app.set('view engine', 'ejs')
app.use(urlencoded({ extended: true }))
app.use(express.static('public'))

//Database setup
mongoose.connect("mongodb+srv://jeff:testpassword123@cluster0.2aum6.mongodb.net/todolistDB?retryWrites=true&w=majority")

//Schemas
const itemsSchema = new mongoose.Schema({
    name: String
})

const Item = mongoose.model("Item", itemsSchema)

//Sample data for Item model
// const item1 = new Item({
//     name: "Welcome to your todolist"
// })

// const item2 = new Item({
//     name: "CLick the + button to add a new item."
// })

// const item3 = new Item({
//     name: "<--- Click this to delete an item."
// })

// const defaultItems = [item1, item2, item3]



//Routes

//Render current list items
app.get('/', (req, res) => {

    Item.find({}, (err, foundItems) => {
         res.render('list', { listTitle: "Today", newListItems: foundItems })
    })
})


//Add list items
app.post('/', (req, res) => {
   const itemName = req.body.newItem

   const item = new Item({
       name: itemName
   })

   item.save()

   res.redirect('/')
})

//Delete list items
app.post('/delete', (req, res) => {
    const checkedItemId = req.body.checkbox
    
    Item.findByIdAndDelete(checkedItemId, (err) => {
        if (!err){
            console.log('Item deleted')
        }
    })

    res.redirect('/')
})












PORT = process.env.PORT || 4000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))

