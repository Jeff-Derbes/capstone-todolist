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

const listSchema = new mongoose.Schema({
    name: String,
    items: [itemsSchema]
})

const Item = mongoose.model("Item", itemsSchema)
const List = mongoose.model("List", listSchema)

//Sample data for List model
const item1 = new Item({
    name: "Welcome to your new custom list!"
})

//Get current date
let today = new Date()
let options = {
    weekday: "long",
    day: "numeric",
    month: "long"
}

let day = today.toLocaleDateString('en-us', options)


//Routes

//Render current list items
app.get('/', (req, res) => {

    Item.find({}, (err, foundItems) => {
         res.render('list', { listTitle: "Your List", newListItems: foundItems, day: day})
    })
})


//Add list items
app.post('/', (req, res) => {
   const itemName = req.body.newItem
   const listName = req.body.list

   const item = new Item({
       name: itemName
   })

   if (listName === "Your List"){
       item.save()
       res.redirect('/')
   }else{
       List.findOne({name: listName}, (err, foundList) => {
           foundList.items.push(item)
           foundList.save()
           res.redirect(`/${listName}`)
       })
   }
})

//Custom lists
app.get('/:customListName', (req, res) => {
    const customListName = req.params.customListName
    List.findOne({name: customListName}, function(err, foundList) {
        if (!err){
            if (!foundList){
                const list = new List({
                    name: customListName,
                    items: item1
                })
            
                list.save();
                res.redirect(`/${customListName}`)
            }else {
                res.render("list", {listTitle: foundList.name, newListItems: foundList.items, day: day})
            }
        }
    })


})

//Delete list items
app.post('/delete', (req, res) => {
    const checkedItemId = req.body.checkbox
    const listName = req.body.listName

    if (listName === "Your List"){
        Item.findByIdAndDelete(checkedItemId, (err) => {
            if (!err){
                console.log('Item deleted')
            }
        })
        res.redirect('/')
    }else{
        List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: checkedItemId}}}, (err, foundList) => {
            if (!err){
                res.redirect(`/${listName}`)
            }
        })
    }
    
})












PORT = process.env.PORT || 4000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))

