import { useEffect, useState } from 'react';

import api from '../../services/api';
import { Header } from '../../components/Header';
import { Food } from '../../components/Food';
import { ModalAddFood } from '../../components/ModalAddFood';
import { ModalEditFood } from '../../components/ModalEditFood';
import { FoodsContainer } from './styles';
import { FoodData } from '../../types/FooData'

type FormData = Omit<FoodData, 'id' | 'available'>


export function Dashboard() {
  const [foods, setFoods] = useState<FoodData[]>([])
  const [editingFood, setEditingFood] = useState<FoodData>({} as FoodData)
  const [modalOpen, setModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)

  useEffect(() => {
    api.get<FoodData[]>('/foods').then(response => setFoods(response.data));
  }, [])
  
  function toggleModal() {
    setModalOpen(!modalOpen)
  }

  function toggleEditModal() {
    setEditModalOpen(!editModalOpen)
  }

  async function handleAddFood(data: FormData) {
    try {
      const response = await api.post('/foods', {
        ...data,
        available: true,
      });

      setFoods([...foods, response.data]);
    } catch (err) {
      console.log(err);
    }    
  }

  async function handleUpdateFood(food: FoodData) {
    try {
      const foodUpdated = await api.put(
        `/foods/${editingFood?.id}`,
        { ...editingFood, ...food },
      );

      setFoods(foods.map(f =>
        f.id !== foodUpdated.data.id ? f : foodUpdated.data,
      ))
    } catch (err) {
      console.log(err);
    }    
  }

  async function handleDeleteFood(id: number) {
    await api.delete(`/foods/${id}`);

    setFoods(foods.filter(food => food.id !== id))
  }

  function handleEditFood(food: FoodData) {
    setEditingFood( food )
    setEditModalOpen( true )
  }

  return (
    <>
      <Header openModal={toggleModal} />
      <ModalAddFood
        isOpen={modalOpen}
        setIsOpen={toggleModal}
        handleAddFood={handleAddFood}
      />
      <ModalEditFood
        isOpen={editModalOpen}
        setIsOpen={toggleEditModal}
        editingFood={editingFood}
        handleUpdateFood={handleUpdateFood}
      />

      <FoodsContainer data-testid="foods-list">
        {foods &&
          foods.map(food => (
            <Food
              key={food.id}
              food={food}
              handleDelete={handleDeleteFood}
              handleEditFood={handleEditFood}
            />
          ))}
      </FoodsContainer>
    </>
  )
}
