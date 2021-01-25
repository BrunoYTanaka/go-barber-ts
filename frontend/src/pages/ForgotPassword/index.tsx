import React, { useCallback, useRef, useState } from 'react'
import * as Yup from 'yup'
import { FiLogIn, FiMail } from 'react-icons/fi'
import { Form } from '@unform/web'
import { FormHandles } from '@unform/core'
import { Link } from 'react-router-dom'
import { Container, Content, AnimationContainer, Background } from './styles'
import logoImg from '../../assets/logo.svg'
import Button from '../../components/Button'
import Input from '../../components/Input'

import { useToast } from '../../hooks/toast'
import getValidationErros from '../../utils/getValidationErrors'
import api from '../../services/api'

interface ForgotPasswordFormData {
  email: string
  password: string
}

const ForgotPassword: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const formRef = useRef<FormHandles>(null)

  const { addToast } = useToast()

  const handleSubmit = useCallback(
    async (data: ForgotPasswordFormData): Promise<void> => {
      try {
        formRef.current?.setErrors({})
        const schema = Yup.object().shape({
          email: Yup.string()
            .email('Digite um email válido')
            .required('E-mail obrigatório'),
        })
        await schema.validate(data, {
          abortEarly: false,
        })
        setLoading(true)
        await api.post('/password/forgot', {
          email: data.email,
        })

        addToast({
          type: 'success',
          title: 'E-mail de recuperação enviado',
          description:
            'Enviamos um e-mail para confirmar a recuperação de senha, cheque seu caixa de entrada',
        })
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErros(err)
          formRef.current?.setErrors(errors)
          return
        }
        addToast({
          type: 'error',
          title: 'Erro na recuperação de senha',
          description:
            'Ocorreu um erro ao fazer a recuperação de senha, tente novamente',
        })
      } finally {
        setLoading(false)
      }
    },
    [addToast],
  )

  return (
    <Container>
      <Content>
        <AnimationContainer>
          <img src={logoImg} alt="GoBarber" />
          <Form ref={formRef} onSubmit={handleSubmit}>
            <h1>Recuperação de senha</h1>
            <Input icon={FiMail} name="email" placeholder="E-mail" />
            <Button loading={loading} type="submit">
              Recuperar
            </Button>
          </Form>
          <Link to="/">
            <FiLogIn />
            Voltar ao login
          </Link>
        </AnimationContainer>
      </Content>
      <Background />
    </Container>
  )
}

export default ForgotPassword
