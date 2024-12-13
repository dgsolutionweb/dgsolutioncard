import { useEffect, useState, useCallback, memo } from 'react'
import styled, { keyframes, createGlobalStyle, ThemeProvider } from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPhone, faEnvelope, faGlobe, faSun, faMoon, faShare, faQrcode } from '@fortawesome/free-solid-svg-icons'
import { faInstagram, faWhatsapp } from '@fortawesome/free-brands-svg-icons'
import { QRCodeSVG } from 'qrcode.react'

interface Theme {
  primary: string;
  background: string;
  cardBg: string;
  text: string;
  buttonBg: string;
  buttonHover: string;
  shadow: string;
  border: string;
}

interface ModalProps {
  isVisible: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

interface ActionButtonsProps {
  isDarkMode: boolean;
  onThemeToggle: () => void;
  onShare: () => void;
  onQRCode: () => void;
}

interface StyledProps {
  theme: Theme;
}

interface StyledButtonProps extends StyledProps {
  className?: string;
}

const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`

const lightTheme: Theme = {
  primary: '#00c6ff',
  background: '#f5f5f5',
  cardBg: '#ffffff',
  text: '#333333',
  buttonBg: '#f0f0f0',
  buttonHover: '#e0e0e0',
  shadow: 'rgba(0, 0, 0, 0.1)',
  border: '#e0e0e0'
}

const darkTheme: Theme = {
  primary: '#00c6ff',
  background: '#121212',
  cardBg: '#1a1a1a',
  text: '#ffffff',
  buttonBg: '#2a2a2a',
  buttonHover: '#3a3a3a',
  shadow: 'rgba(0, 0, 0, 0.4)',
  border: '#323232'
}

const GlobalStyle = createGlobalStyle<StyledProps>`
  body {
    background: ${({ theme }) => theme.background};
    color: ${({ theme }) => theme.text};
    transition: all 0.3s ease;
  }
`

const PhoneContainer = styled.div<ContentWrapperProps>`
  width: 340px;
  height: 680px;
  background: ${({ theme }) => theme.cardBg};
  border-radius: 45px;
  padding: 20px;
  position: relative;
  margin: 50px auto;
  box-shadow: 
    0 10px 30px ${({ theme }) => theme.shadow},
    inset 0 1px 1px rgba(255,255,255,0.1);
  border: 8px solid ${({ theme }) => theme.border};
  animation: ${fadeInUp} 0.8s ease-out;
  overflow: hidden;
  transform-style: preserve-3d;
  perspective: 1000px;
  transition: all 0.3s ease;
`

const Screen = styled.div<ContentWrapperProps>`
  background: ${({ theme }) => theme.cardBg};
  height: 100%;
  border-radius: 35px;
  padding: 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: ${({ theme }) => theme.text};
  box-shadow: inset 0 2px 10px ${({ theme }) => theme.shadow};
  position: relative;
  overflow: hidden;
  transform-style: preserve-3d;
`

const ContentWrapper = styled.div`
  position: relative;
  z-index: 1;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 10px 0 70px 0;
`

const TopSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
`

const ButtonsSection = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 6px;
`

const ContactButton = styled.a<StyledButtonProps>`
  width: 100%;
  padding: 12px;
  margin: 3px 0;
  background: ${({ theme, className }) => 
    className === 'whatsapp' 
      ? 'linear-gradient(145deg, #25D366, #128C7E)'
      : `linear-gradient(145deg, ${theme.buttonBg}, ${theme.buttonHover})`};
  border-radius: 12px;
  display: flex;
  align-items: center;
  text-decoration: none;
  color: ${({ theme }) => theme.text};
  font-weight: 500;
  letter-spacing: 0.5px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 
    0 4px 8px ${({ theme }) => theme.shadow},
    inset 0 1px 1px rgba(255,255,255,0.1);
  position: relative;
  overflow: hidden;
  animation: ${fadeInUp} 0.8s ease-out;
  opacity: 0;
  animation-fill-mode: forwards;

  &:hover {
    transform: translateY(-2px);
    background: ${({ theme, className }) => 
      className === 'whatsapp'
        ? 'linear-gradient(145deg, #2EE273, #159C8E)'
        : `linear-gradient(145deg, ${theme.buttonHover}, ${theme.buttonBg})`};
  }

  svg {
    margin-right: 12px;
    width: 18px;
    height: 18px;
    color: ${({ theme }) => theme.text};
    filter: drop-shadow(0 2px 3px rgba(0,0,0,0.2));
    transition: transform 0.3s ease;
  }

  &:hover svg {
    transform: scale(1.1) rotate(-5deg);
  }
`

const LogoContainer = styled.div`
  width: 100px;
  height: 100px;
  margin-bottom: 5px;
  padding: 10px;
  border-radius: 20px;
  background: rgba(0, 198, 255, 0.03);
  box-shadow: 0 0 20px rgba(0, 198, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 0 30px rgba(0, 198, 255, 0.2);
  }
`

const Logo = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
  filter: drop-shadow(0 4px 6px rgba(0, 198, 255, 0.2));
  transition: all 0.3s ease;
`

const Name = styled.h1`
  font-size: 24px;
  margin: 5px 0 2px 0;
  color: #fff;
  text-shadow: 0 2px 4px rgba(0,0,0,0.3);
  font-weight: 700;
  letter-spacing: 0.5px;
  
  span {
    background: linear-gradient(45deg, #00c6ff, #0072ff);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    font-weight: 800;
  }
`

const Title = styled.h2`
  font-size: 12px;
  color: #a0a0a0;
  margin: 0 0 10px 0;
  font-weight: 400;
  letter-spacing: 1px;
  text-transform: uppercase;
  
  span {
    color: #00c6ff;
  }
`

const NotchArea = styled.div`
  width: 160px;
  height: 28px;
  background: #000;
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  border-bottom-left-radius: 18px;
  border-bottom-right-radius: 18px;
  box-shadow: 
    inset 0 -2px 5px rgba(255,255,255,0.1),
    0 2px 5px rgba(0,0,0,0.2);
  z-index: 2;
  
  &:before {
    content: '';
    position: absolute;
    width: 8px;
    height: 8px;
    background: #333;
    border-radius: 50%;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    box-shadow: inset 0 1px 2px rgba(0,0,0,0.5);
  }
`

const ActionButtonsContainer = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  gap: 12px;
  z-index: 10;
  padding: 12px;
  background: ${({ theme }) => theme.cardBg};
  border-radius: 0 0 35px 35px;
  box-shadow: 
    0 -4px 12px ${({ theme }) => theme.shadow},
    inset 0 1px 1px rgba(255,255,255,0.1);
  border-top: 1px solid ${({ theme }) => theme.border};
`

const ActionButton = styled.button`
  background: ${({ theme }) => `linear-gradient(145deg, ${theme.buttonBg}, ${theme.buttonHover})`};
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.text};
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 
    0 4px 8px ${({ theme }) => theme.shadow},
    inset 0 1px 1px rgba(255,255,255,0.1);
  border: 1px solid ${({ theme }) => theme.border};

  &:hover {
    transform: translateY(-2px);
    background: ${({ theme }) => `linear-gradient(145deg, ${theme.buttonHover}, ${theme.buttonBg})`};
  }

  svg {
    font-size: 18px;
    filter: drop-shadow(0 2px 3px rgba(0,0,0,0.2));
    transition: transform 0.3s ease;
  }

  &:hover svg {
    transform: scale(1.1) rotate(-5deg);
  }
`

const ModalOverlay = styled.div<{ $isVisible: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: ${({ $isVisible }) => $isVisible ? 'flex' : 'none'};
  justify-content: center;
  align-items: center;
  z-index: 1000;
`

const ModalContent = styled.div`
  background: ${({ theme }) => theme.cardBg};
  padding: 25px;
  border-radius: 20px;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  
  h3 {
    margin-bottom: 20px;
    color: ${({ theme }) => theme.text};
  }
`

const Modal: React.FC<ModalProps> = memo(({ isVisible, onClose, children }) => {
  return (
    <ModalOverlay $isVisible={isVisible} onClick={onClose}>
      <ModalContent onClick={e => e.stopPropagation()}>
        {children}
      </ModalContent>
    </ModalOverlay>
  )
})

Modal.displayName = 'Modal'

const ActionButtons: React.FC<ActionButtonsProps> = memo(({ 
  isDarkMode, 
  onThemeToggle, 
  onShare, 
  onQRCode 
}) => (
  <ActionButtonsContainer>
    <ActionButton onClick={onThemeToggle}>
      <FontAwesomeIcon icon={isDarkMode ? faSun : faMoon} />
    </ActionButton>
    <ActionButton onClick={onShare}>
      <FontAwesomeIcon icon={faShare} />
    </ActionButton>
    <ActionButton onClick={onQRCode}>
      <FontAwesomeIcon icon={faQrcode} />
    </ActionButton>
  </ActionButtonsContainer>
))

ActionButtons.displayName = 'ActionButtons'

const ContactButtons: React.FC = memo(() => (
  <ButtonsSection>
    <ContactButton href="tel:+5517999754390">
      <FontAwesomeIcon icon={faPhone} />
      Ligar
    </ContactButton>

    <ContactButton href="mailto:dgsolutionweb@gmail.com">
      <FontAwesomeIcon icon={faEnvelope} />
      Email
    </ContactButton>

    <ContactButton className="whatsapp" href="https://wa.me/5517999754390" target="_blank">
      <FontAwesomeIcon icon={faWhatsapp} />
      WhatsApp
    </ContactButton>

    <ContactButton href="https://instagram.com/dgsolutionweb" target="_blank">
      <FontAwesomeIcon icon={faInstagram} />
      Instagram
    </ContactButton>

    <ContactButton href="https://dgsolutionweb.github.io/dgsolutionweb/" target="_blank">
      <FontAwesomeIcon icon={faGlobe} />
      Website
    </ContactButton>
  </ButtonsSection>
))

ContactButtons.displayName = 'ContactButtons'

const App: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  })
  const [showQRCode, setShowQRCode] = useState<boolean>(false)
  const [rotation, setRotation] = useState<{ x: number; y: number }>({ x: 0, y: 0 })

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = (e: MediaQueryListEvent) => setIsDarkMode(e.matches)
    mediaQuery.addListener(handleChange)
    return () => mediaQuery.removeListener(handleChange)
  }, [])

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const { clientX, clientY } = e
    const { innerWidth, innerHeight } = window
    const x = (clientX - innerWidth / 2) / 50
    const y = (clientY - innerHeight / 2) / 50
    setRotation({ x: y, y: x })
  }, [])

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [handleMouseMove])

  const handleShare = useCallback(async (): Promise<void> => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'DGSolutionWEB',
          text: 'Confira nosso cartão digital!',
          url: window.location.href
        })
      } catch (error) {
        console.log('Erro ao compartilhar:', error)
      }
    }
  }, [])

  const toggleTheme = useCallback(() => setIsDarkMode(prev => !prev), [])
  const toggleQRCode = useCallback(() => setShowQRCode(prev => !prev), [])

  return (
    <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <GlobalStyle />
      <PhoneContainer style={{ 
        transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`
      }}>
        <NotchArea />
        <Screen>
          <ContentWrapper>
            <TopSection>
              <LogoContainer>
                <Logo src="/logo.png" alt="DGSolutionWEB Logo" />
              </LogoContainer>
              <Name><span>DGSolution</span>WEB</Name>
              <Title>Soluções em <span>Desenvolvimento Web</span></Title>
            </TopSection>

            <ContactButtons />

            <ActionButtons 
              isDarkMode={isDarkMode}
              onThemeToggle={toggleTheme}
              onShare={handleShare}
              onQRCode={toggleQRCode}
            />
          </ContentWrapper>
        </Screen>
      </PhoneContainer>

      <Modal isVisible={showQRCode} onClose={toggleQRCode}>
        <h3>Escaneie o QR Code</h3>
        <QRCodeSVG 
          value={window.location.href}
          size={200}
          level="H"
          includeMargin={true}
        />
      </Modal>
    </ThemeProvider>
  )
}

export default memo(App)
