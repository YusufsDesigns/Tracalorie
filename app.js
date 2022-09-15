// Storage Controller
const StorageCtrl = (function(){

    // Public methods
    return{
        storeItem : function(item){
            let items;
            // Check if any items in ls
            if(localStorage.getItem('items') === null){
                items = [];
                // Push new item
                items.push(item);
                // Set ls
                localStorage.setItem('items', JSON.stringify(items));
            } else{
                items =JSON.parse(localStorage.getItem('items'));

                // Push new item
                items.push(item);

                // Reset ls
                localStorage.setItem('items', JSON.stringify(items));
            }
        },
        getItemsFromStorage : function(){
            let items;
            if(localStorage.getItem('items') === null){
                items = [];
            } else{
                items = JSON.parse(localStorage.getItem('items'));
            }
            return items;
        },
        updateItemStorage : function(updatedItem){
            let items = JSON.parse(localStorage.getItem('items'));

            items.forEach(function(item, index){
                if(updatedItem.id === item.id){
                    items.splice(index, 1, updatedItem);
                }
            });
            localStorage.setItem('items', JSON.stringify(items));
        },
        deleteItemFromStorage : function(id){
            let items = JSON.parse(localStorage.getItem('items'));

            items.forEach(function(item, index){
                if(id === item.id){
                    items.splice(index, 1);
                }
            });
            localStorage.setItem('items', JSON.stringify(items));
        },
        clearAllItemsFromStorage: function(){
            localStorage.removeItem('items');
        }
    }
})();

// Item Controller
const ItemCtrl = (function(){
    // Item Constructor
    const Item = function(id, name, calories){
        this.id = id;
        this.name = name;
        this.calories = calories;
    }

    // Data Structure / State
    const data = {
        items: StorageCtrl.getItemsFromStorage(),
        currentItem: null,
        totalCalories: 0
    }

    return{
        getItems: function(){
            return data.items;
        },
        addItem: function(name, calories){
            let ID;
            //  Create ID
            if(data.items.length > 0){
                ID = data.items[data.items.length - 1].id + 1;
            } else{
                ID = 0
            }

            // Calories to number
            calories = parseInt(calories);

            // Create new item
            newItem = new Item(ID, name, calories);

            // Add to items array
            data.items.push(newItem);

            return newItem;
        },
        getItemById: function(id){
            let found = null;
            // loop through items
            data.items.forEach(function(item){
                if(item.id == id){
                    found = item;
                }
            });

            return found;
        },
        getTotalCalories: function(){
            let total = 0;

            // Loop through items and add calories
            data.items.forEach(function(item){
                total += item.calories;
            });

            // Set total cal in data structure
            data.totalCalories = total;

            // Return total
            return total;
        },
        logData: function(){
            return data;
        },
        setCurrentItem: function(item){
            data.currentItem = item;
        },
        getCurrentItem: function(){
            return data.currentItem;
        },
        updateItem: function(name, calories){
            // Calories to number
            calories = parseInt(calories);

            let found = null;

            data.items.forEach(function(item){
                if(item.id == data.currentItem.id){
                    item.name = name;
                    item.calories = calories;
                    found = item;
                }
            });
            return found;
        },
        deleteItem: function(id){
            // Get ids
            const ids = data.items.map(function(item){
                return item.id;
            });

            // Get index
            const index = ids.indexOf(id);

            // Remove items
            data.items.splice(index, 1);
        },
        clearAllItems: function(){
            data.items = [];
        }
    }
})();

// UI Controller
const UICtrl = (function(){
    const UISelectors = {
        itemList: '#item-list',
        listItems: '#item-list li',
        addBtn: '.add-btn',
        updateBtn: '.update-btn',
        deleteBtn: '.delete-btn',
        backBtn: '.back-btn',
        clearBtn: '.clear-btn',
        itemNameInput: '#item-name',
        itemCaloriesInput: '#item-calories',
        totalCalories: '.total-calories'
    }

    // Public Methods
    return{
        populateItemsList: function(items){
            let html = ''

            items.forEach(function(item){
                html += `
                    <li id="item-${item.id}" class="collection-item" id="item-0">
                        <strong>${item.name}:</strong> <em>${item.calories} Calories</em>
                        <a href="#" class="secondary-content">
                            <i class="fa-solid fa-pencil edit-item"></i>
                        </a>
                    </li>
                    `
            });

            // Insert list items
            document.querySelector(UISelectors.itemList).innerHTML = html;
        },
        getSelectors: function(){
            return UISelectors;
        },
        getItemInput: function(){
            return{
                name: document.querySelector(UISelectors.itemNameInput).value,
                calories: document.querySelector(UISelectors.itemCaloriesInput).value
            }
        },
        addListItem: function(item){
            // Show the list
            document.querySelector(UISelectors.itemList).style.display = 'block';
            // Create li element
            const li = document.createElement('li');
            // Add class
            li.className = 'collection-item';
            // Add ID
            li.id = `item-${item.id}`;
            // Add HTML
            li.innerHTML = `<strong>${item.name}:</strong> <em>${item.calories} Calories</em>
            <a href="#" class="secondary-content">
                <i class="fa-solid fa-pencil edit-item"></i>
            </a>`
            // Insert item
            document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend', li);
        },
        updateListItem: function(item){
            let listItems = document.querySelectorAll(UISelectors.listItems);

            listItems.forEach(function(listItem){
                const itemId = listItem.getAttribute('id');

                if(itemId === `item-${item.id}`){
                    document.querySelector(`#${itemId}`).innerHTML = `<strong>${item.name}:</strong> <em>${item.calories} Calories</em>
                    <a href="#" class="secondary-content">
                        <i class="fa-solid fa-pencil edit-item"></i>
                    </a>`
                }
            });
        },
        deleteListItem: function(id){
            const itemId  = `#item-${id}`;
            const item = document.querySelector(itemId);
            item.remove();
        },
        removeAllItems: function(){
            let listItems = document.querySelectorAll(UISelectors.listItems);

            listItems.forEach(function(item){
                item.remove();
            })
        },
        addItemToForm: function(){
            document.querySelector(UISelectors.itemNameInput).value = ItemCtrl.getCurrentItem().name;
            document.querySelector(UISelectors.itemCaloriesInput).value = ItemCtrl.getCurrentItem().calories;
            UICtrl.showEditState();
        },
        clearInput: function(){
            document.querySelector(UISelectors.itemNameInput).value = '';
            document.querySelector(UISelectors.itemCaloriesInput).value = '';
        },
        hideList: function(){
            document.querySelector(UISelectors.itemList).style.display = 'none';
        },
        showTotalCalories: function(totalCalories){
            document.querySelector(UISelectors.totalCalories).innerHTML = totalCalories;
        },
        clearEditState: function(e){
            UICtrl.clearInput();
            document.querySelector(UISelectors.updateBtn).style.display = 'none';
            document.querySelector(UISelectors.deleteBtn).style.display = 'none';
            document.querySelector(UISelectors.backBtn).style.display = 'none';
            document.querySelector(UISelectors.addBtn).style.display = 'inline';
        },
        showEditState: function(){
            document.querySelector(UISelectors.updateBtn).style.display = 'inline';
            document.querySelector(UISelectors.deleteBtn).style.display = 'inline';
            document.querySelector(UISelectors.backBtn).style.display = 'inline';
            document.querySelector(UISelectors.addBtn).style.display = 'none';
        }
    }

})();


// App Controller
const App = (function(StorageCtrl,ItemCtrl, UICtrl){
    // Load event listeners
    const loadEventListeners = function(){
        // Get UI Selectors
        const UISelectors = UICtrl.getSelectors();

        // Add item event
        document.querySelector(UISelectors.addBtn).addEventListener("click", itemAddSubmit);

        // Disable submit on enter
        document.addEventListener('keypress', function(e){
            if (e.keyCode === 13 || e.which === 13) {
                e.preventDefault();
                return false;
            }
        })

        // Edit icon click event
        document.querySelector(UISelectors.itemList).addEventListener("click", itemEditClick);

        // Update Item event
        document.querySelector(UISelectors.updateBtn).addEventListener("click", itemUpdateSubmit);

        // Delete Item event
        document.querySelector(UISelectors.deleteBtn).addEventListener("click", itemDeleteSubmit);

        // Back button event
        document.querySelector(UISelectors.backBtn).addEventListener("click", function(e){
            UICtrl.clearEditState();

            e.preventDefault();
        });

        // Clear Item event
        document.querySelector(UISelectors.clearBtn).addEventListener("click", clearAllItems);
    }

    // Add item submit
    const itemAddSubmit = function(e){
        // Get form input from UI controller
        const input = UICtrl.getItemInput();

        // Check for name and calorie input
        if(input.name  !== '' && input.calories !== ''){
            // Add item
            const newItem = ItemCtrl.addItem(input.name, input.calories);

            // Add item to UI list
            UICtrl.addListItem(newItem);

            // Get total calories
            const totalCalories = ItemCtrl.getTotalCalories();

            // Add total calories to UI 
            UICtrl.showTotalCalories(totalCalories);

            // Store in local storage 
            StorageCtrl.storeItem(newItem);

            // Clear Input
            UICtrl.clearInput();
        }

        e.preventDefault();
    };

    // item edit click 
    const itemEditClick = function(e){
        if(e.target.classList.contains('edit-item')){
            // Get list item id
            const listId = e.target.parentNode.parentNode.id;
            
            // Break into an array
            const listIdArray = listId.split('-');

            // Get the actual ID
            const id = parseInt(listIdArray[1]);

            // Get item
            const itemToEdit = ItemCtrl.getItemById(id);

            // Set current item
            ItemCtrl.setCurrentItem(itemToEdit);

            // Add item to form
            UICtrl.addItemToForm();
        }

        e.preventDefault();
    }

    // Item update submit
    const itemUpdateSubmit = function(e){
        // Get item input
        const input = UICtrl.getItemInput();

        // Update item
        const updatedItem = ItemCtrl.updateItem(input.name, input.calories);

        // Update UI
        UICtrl.updateListItem(updatedItem);

        // Get total calories
        const totalCalories = ItemCtrl.getTotalCalories();

        // Add total calories to UI 
        UICtrl.showTotalCalories(totalCalories);

        // Update local storage
        StorageCtrl.updateItemStorage(updatedItem);

        // Clear Edit state
        UICtrl.clearEditState();

        e.preventDefault();
    }

        // Delete event
        const itemDeleteSubmit = function(e){
            // Get current item
            const currentItem = ItemCtrl.getCurrentItem();

            // Delete from data structure
            ItemCtrl.deleteItem(currentItem.id);

            // Delete from UI
            UICtrl.deleteListItem(currentItem.id);

            // Get total calories
            const totalCalories = ItemCtrl.getTotalCalories();

            // Add total calories to UI 
            UICtrl.showTotalCalories(totalCalories);

            // Delete from local storage
            StorageCtrl.deleteItemFromStorage(currentItem.id);

            // Clear Edit state
            UICtrl.clearEditState();

        
            e.preventDefault();
        }

        // Clear items event
        const clearAllItems = function(){
            // Delete all items from data structure
            ItemCtrl.clearAllItems();

            // Get total calories
            const totalCalories = ItemCtrl.getTotalCalories();

            // Add total calories to UI 
            UICtrl.showTotalCalories(totalCalories);

            // Remove all items from UI
            UICtrl.removeAllItems();

            // Remove all items from local storage
            StorageCtrl.clearAllItemsFromStorage();

            // Hide List
            UICtrl.hideList();
        }
    
    // Public Method
    return{
        init: function(){
            // Set initial state
            UICtrl.clearEditState();

            // Fetch items from data structure
            const items = ItemCtrl.getItems();

            // Check if any items
            if(items.length === 0){
                UICtrl.hideList();
            } else{
            // Populate list with items
            UICtrl.populateItemsList(items);
            }

            // Get total calories
            const totalCalories = ItemCtrl.getTotalCalories();

            // Add total calories to UI 
            UICtrl.showTotalCalories(totalCalories);

            // Load event listeners
            loadEventListeners();
        }
    }

})(StorageCtrl,ItemCtrl, UICtrl);

// Initializing App
App.init();
