import { env } from '@env'
import {
  Body,
  Column,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Text,
  render,
} from '@react-email/components'

interface DeleteProjectProps {
  actionLabel: string
  userName: string
  projectName: string
  logo: string
}

export const DeleteProjectTemplate = ({
  actionLabel,
  userName,
  projectName,
  logo,
}: DeleteProjectProps) => {
  return (
    <Html>
      <Head />
      <Preview>{actionLabel}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section>
            <Row style={header}>
              <Column>
                <Img src={logo} width='80' height='40' alt='' />
              </Column>
            </Row>
            <Hr style={hr} />
          </Section>
          <Section style={infoSection}>
            <Text style={infoText}>Hello, {userName}</Text>

            <Text style={infoText}>
              We wanted to let you know that your project{' '}
              <strong>{projectName}</strong> , has been successfully deleted
              from your account.
            </Text>
            <Text style={infoText}>
              If you have any questions or need assistance, feel free to reach
              out to our{' '}
              <Link href={`${env?.PAYLOAD_URL}/support`}>support team.</Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

export const DeleteProject = (props: DeleteProjectProps) =>
  render(<DeleteProjectTemplate {...props} />, { pretty: true })

const infoSection = {
  marginBottom: '24px',
}

const header = {
  display: 'flex',
  alignItems: 'center',
  paddingTop: '10px',
}

const main = {
  backgroundColor: '#fff',
  color: '#f1f5f9',
  margin: 'auto',
  padding: '10px 0px',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji"',
}

const container = {
  maxWidth: '600px',
  backgroundColor: '#10141E',
  margin: 'auto',
  padding: '24px',
}

const hr = {
  borderColor: '#334155',
  margin: '20px 0',
}

const infoText = {
  margin: '0 0 10px 0',
  fontSize: '14px',
  color: '#f1f5f9',
  textAlign: 'left' as const,
}
