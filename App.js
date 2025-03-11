import React, { createContext, useContext, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Modal, TextInput, StyleSheet } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

const ItemContext = createContext();

const ItemProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);

  const addItem = (text) => {
    setItems([...items, { id: Date.now().toString(), text }]);
    setModalVisible(false);
  };

  const deleteItem = (id) => {
    setItems(items.filter(item => item.id !== id));
  };

  const updateItem = (id, newText) => {
    setItems(items.map(item => (item.id === id ? { ...item, text: newText } : item)));
    setModalVisible(false);
  };

  return (
    <ItemContext.Provider value={{ items, addItem, deleteItem, updateItem, modalVisible, setModalVisible, currentItem, setCurrentItem }}>
      {children}
    </ItemContext.Provider>
  );
};

const ItemList = () => {
  const { items, deleteItem, setModalVisible, setCurrentItem } = useContext(ItemContext);
  
  return (
    <FlatList
      data={items}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <View style={styles.item}>
          <Text style={styles.itemText}>{item.text}</Text>
          <View style={styles.actions}>
            <TouchableOpacity onPress={() => { setCurrentItem(item); setModalVisible(true); }}>
              <Text style={styles.edit}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => deleteItem(item.id)}>
              <Text style={styles.delete}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    />
  );
};

const ItemModal = () => {
  const { modalVisible, setModalVisible, addItem, updateItem, currentItem, setCurrentItem } = useContext(ItemContext);
  const [text, setText] = useState('');

  React.useEffect(() => {
    if (currentItem) {
      setText(currentItem.text);
    } else {
      setText('');
    }
  }, [currentItem]);

  const handleSubmit = () => {
    if (currentItem) {
      updateItem(currentItem.id, text);
      setCurrentItem(null);
    } else {
      addItem(text);
    }
    setText('');
  };

  return (
    <Modal visible={modalVisible} transparent>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <TextInput placeholder="Enter text" value={text} onChangeText={setText} style={styles.input} />
          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>{currentItem ? "Update Item" : "Add Item"}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={() => { setModalVisible(false); setCurrentItem(null); }}>
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const AddItemButton = () => {
  const { setModalVisible } = useContext(ItemContext);
  return (
    <TouchableOpacity style={styles.button} onPress={() => setModalVisible(true)}>
      <Text style={styles.buttonText}>Add Item</Text>
    </TouchableOpacity>
  );
};

export default function App() {
  return (
    <SafeAreaProvider>
      <ItemProvider>
        <SafeAreaView style={styles.container}>
          <StatusBar style="auto" />
          <AddItemButton />
          <ItemList />
          <ItemModal />
        </SafeAreaView>
      </ItemProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#303030' },
  item: { flexDirection: 'row', justifyContent: 'space-between', padding: 10, borderBottomWidth: 1 },
  itemText: { color: 'white' },
  actions: { flexDirection: 'row' },
  edit: { color: 'white', marginRight: 10 },
  delete: { color: '#FF6961' },
  modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContent: { backgroundColor: 'white', padding: 20, borderRadius: 10, width: '80%' },
  input: { borderBottomWidth: 1, marginBottom: 10, padding: 5 },
  button: { backgroundColor: '#FF6961', padding: 10, borderRadius: 5, alignItems: 'center', marginTop: 10 },
  buttonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  cancelButton: { backgroundColor: 'gray' }
});
