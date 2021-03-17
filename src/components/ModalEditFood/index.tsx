import { useRef } from 'react';
import { FiCheckSquare } from 'react-icons/fi';
import { FormHandles } from '@unform/core';

import { Form } from './styles';
import { Modal } from '../Modal';
import { Input } from '../Input';
import { FoodData } from '../../types/FooData';

interface ModalEditFoodProps {
  isOpen: boolean
  editingFood: FoodData
  setIsOpen: () => void
  handleUpdateFood: (food: FoodData) => void
}

interface FormData {
  image: string
  name: string
  price: number
  description: string
}

export function ModalEditFood({ isOpen, setIsOpen, editingFood, handleUpdateFood } : ModalEditFoodProps) {
  const formRef = useRef<FormHandles>(null)

  async function handleSubmit(data: FormData) {
    handleUpdateFood({ ...editingFood, ...data });
    setIsOpen();    
  }

  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
      <Form ref={formRef} onSubmit={handleSubmit} initialData={editingFood}>
        <h1>Editar Prato</h1>
        <Input name="image" placeholder="Cole o link aqui" />

        <Input name="name" placeholder="Ex: Moda Italiana" />
        <Input name="price" placeholder="Ex: 19.90" />

        <Input name="description" placeholder="Descrição" />

        <button type="submit" data-testid="edit-food-button">
          <div className="text">Editar Prato</div>
          <div className="icon">
            <FiCheckSquare size={24} />
          </div>
        </button>
      </Form>
    </Modal>    
  )
}