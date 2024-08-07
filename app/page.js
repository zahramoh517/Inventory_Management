'use client'

import { useState, useEffect } from 'react'
import { Box, Stack, Typography, Button, Modal, TextField, Paper } from '@mui/material'
import { styled } from '@mui/system'
import { firestore } from '@/firebase'
import {
  collection, doc, getDocs, setDoc, deleteDoc, getDoc,
} from 'firebase/firestore'

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: 'none',
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
}

const AnimatedButton = styled(Button)(({ theme }) => ({
  transition: 'transform 0.2s ease-in-out',
  '&:hover': {
    transform: 'scale(1.1)',
  },
}));

export default function Home() {
  const [inventory, setInventory] = useState([])
  const [filteredInventory, setFilteredInventory] = useState([])
  const [open, setOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [itemName, setItemName] = useState('')
  const [editItemName, setEditItemName] = useState('')
  const [editItemQuantity, setEditItemQuantity] = useState(0)
  const [searchTerm, setSearchTerm] = useState('')

  const updateInventory = async () => {
    try {
      const snapshot = await getDocs(collection(firestore, 'inventory'))
      const inventoryList = []
      snapshot.forEach((doc) => {
        inventoryList.push({ id: doc.id, ...doc.data() })
      })
      setInventory(inventoryList)
      setFilteredInventory(inventoryList) //FIX
    } catch (error) {
      console.error('Error fetching inventory:', error)
    }
  }

  useEffect(() => {
    updateInventory() //does not add to firebase FIX
  }, [])

  const addItem = async (item) => {
    try {
      const docRef = doc(firestore, 'inventory', item)
      const docSnap = await getDoc(docRef)

      if (docSnap.exists()) {
        const { quantity } = docSnap.data()
        await setDoc(docRef, { quantity: quantity + 1 }, { merge: true })
      } else {
        await setDoc(docRef, { quantity: 1 })
      }
      await updateInventory()
    } catch (error) {
      console.error('Error adding item:', error)
    }
  }

  const removeItem = async (item) => {
    try {
      const docRef = doc(firestore, 'inventory', item)
      const docSnap = await getDoc(docRef)

      if (docSnap.exists()) {
        const { quantity } = docSnap.data()
        if (quantity > 1) {
          await setDoc(docRef, { quantity: quantity - 1 }, { merge: true })
        } else {
          await deleteDoc(docRef)
        }
      }
      await updateInventory()
    } catch (error) {
      console.error('Error removing item:', error)
    }
  }

  const editItem = async () => {//place it to the very right maybe?
    try {
      const docRef = doc(firestore, 'inventory', editItemName)
      await setDoc(docRef, { quantity: editItemQuantity }, { merge: true })
      setEditOpen(false)
      await updateInventory()
    } catch (error) {
      console.error('Error editing item:', error) 
    }
  }

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  const handleEditOpen = (itemName, quantity) => {
    setEditItemName(itemName)
    setEditItemQuantity(quantity)
    setEditOpen(true)
  }

  const handleEditClose = () => setEditOpen(false)

  const handleSearch = (term) => {
    setSearchTerm(term)
    if (term === '') {
      setFilteredInventory(inventory)
    } else {
      const filtered = inventory.filter(item =>
        item.id.toLowerCase().includes(term.toLowerCase())
      )
      setFilteredInventory(filtered)
    }
  }

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      alignItems="center"
      p={4}
      sx={{ backgroundColor: '#f0f5f1' }}
    >
      <Paper elevation={3} sx={{ width: '80%', p: 4, mb: 4, textAlign: 'center', backgroundColor: '#ffffff', borderRadius: '10px' }}>
        <Typography variant="h4" color="primary" gutterBottom>
          Inventory Management
        </Typography>
        <TextField
          label="Search Items"
          variant="outlined"
          fullWidth
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          sx={{ marginBottom: 2 }}
        />
        <AnimatedButton variant="contained" color="success" onClick={handleOpen} sx={{ marginBottom: 2 }}>
          Add New Item
        </AnimatedButton>
        <Box border={'1px solid #ccc'} borderRadius={2}>
          <Box
            height="60px"
            bgcolor="#a5d6a7"
            display="flex"
            justifyContent="center"
            alignItems="center"
            borderRadius="8px 8px 0 0"
          >
            <Typography variant="h5" color="#ffffff">
              Inventory Items
            </Typography>
          </Box>
          <Stack height="400px" spacing={2} overflow="auto" p={2}>
            {filteredInventory.map(({ id, quantity }) => (
              <Paper
                key={id}
                elevation={1}
                sx={{ padding: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderRadius: '8px', transition: 'transform 0.2s', '&:hover': { transform: 'scale(1.02)' } }}
              >
                <Typography variant="h6" color="textPrimary">
                  {id.charAt(0).toUpperCase() + id.slice(1)}
                </Typography>
                <Typography variant="h6" color="textSecondary">
                  {quantity}
                </Typography>
                <Stack direction="row" spacing={1}>
                  <AnimatedButton variant="outlined" color="success" onClick={() => addItem(id)}>
                    Add
                  </AnimatedButton>
                  <AnimatedButton variant="outlined" color="info" onClick={() => handleEditOpen(id, quantity)}>
                    Edit
                  </AnimatedButton>
                  <AnimatedButton variant="contained" color="error" onClick={() => removeItem(id)}>
                    Remove
                  </AnimatedButton>
                </Stack>
              </Paper>
            ))}
          </Stack>
        </Box>
      </Paper>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Add Item
          </Typography>
          <Stack width="100%" direction={'row'} spacing={2}>
            <TextField
              id="outlined-basic"
              label="Item"
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
            <Button
              variant="contained"
              color="success"
              onClick={() => {
                addItem(itemName)
                setItemName('')
                handleClose()
              }}
            >
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>

      <Modal
        open={editOpen}
        onClose={handleEditClose}
        aria-labelledby="edit-modal-title"
        aria-describedby="edit-modal-description"
      >
        <Box sx={style}>
          <Typography id="edit-modal-title" variant="h6" component="h2">
            Edit Item
          </Typography>
          <TextField
            id="outlined-basic"
            label="Quantity"
            variant="outlined"
            fullWidth
            type="number"
            value={editItemQuantity}
            onChange={(e) => setEditItemQuantity(Number(e.target.value))}
          />
          <Button
            variant="contained"
            color="success"
            onClick={editItem}
            sx={{ marginTop: 2 }}
          >
            Save
          </Button>
        </Box>
      </Modal>
    </Box>
  )
}
