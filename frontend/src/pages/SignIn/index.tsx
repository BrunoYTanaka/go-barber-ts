import React, { useCallback, useRef } from 'react'
import * as Yup from 'yup'
import { FiLogIn, FiMail, FiLock } from 'react-icons/fi'
import { Form } from '@unform/web'
import { FormHandles } from '@unform/core'
import { Link, useHistory } from 'react-router-dom'
import { Container, Content, AnimationContainer, Background } from './styles'
import logoImg from '../../assets/logo.svg'
import Button from '../../components/Button'
import Input from '../../components/Input'

import { useAuth } from '../../hooks/auth'
import { useToast } from '../../hooks/toast'
import getValidationErros from '../../utils/getValidationErrors'

interface SignInFormData {
  email: string
  password: string
}

const SignIn: React.FC = () => {
  const formRef = useRef<FormHandles>(null)

  const { signIn } = useAuth()
  const { addToast } = useToast()
  const history = useHistory()

  const handleSubmit = useCallback(
    async (data: SignInFormData): Promise<void> => {
      try {
        formRef.current?.setErrors({})
        const schema = Yup.object().shape({
          email: Yup.string()
            .email('Digite um email válido')
            .required('E-mail obrigatório'),
          password: Yup.string().required('Senha obrigatória'),
        })
        await schema.validate(data, {
          abortEarly: false,
        })
        await signIn({
          email: data.email,
          password: data.password,
        })
        history.push('/dashboard')
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErros(err)
          formRef.current?.setErrors(errors)
          return
        }
        addToast({
          type: 'error',
          title: 'Erro na autenticação',
          description:
            'Ocorreu um erro ao fazer o login, cheque as credenciais',
        })
      }
    },
    [signIn, addToast, history],
  )

  return (
    <Container>
      <Content>
        <AnimationContainer>
          <img src={logoImg} alt="GoBarber" />
          <Form ref={formRef} onSubmit={handleSubmit}>
            <h1>Faça seu login</h1>
            <Input icon={FiMail} name="email" placeholder="E-mail" />
            <Input
              icon={FiLock}
              name="password"
              type="password"
              placeholder="Senha"
            />
            <Button type="submit">Entrar</Button>
            <Link to="forgot">Esqueci a minha senha</Link>
          </Form>
          <Link to="/signup">
            <FiLogIn />
            Criar conta
          </Link>
        </AnimationContainer>
      </Content>
      <Background />
    </Container>
  )
}

export default SignIn
