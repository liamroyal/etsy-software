import React, { useState } from 'react';
import styled from 'styled-components';
import { Sidebar } from '../Sidebar/Sidebar';
import { PageType } from '../../../types/navigation';
import { MainContent } from '../MainContent/MainContent';
import { useMediaQuery } from '../../../hooks/useMediaQuery';

interface AppLayoutProps {
  currentPage: PageType;
  onPageChange: (page: PageType) => void;
  children: React.ReactNode;
}

const Container = styled.div`
  display: flex;
  height: 100vh;
  position: relative;
  overflow: hidden;
`;

const MobileMenuButton = styled.button`
  display: none;
  position: fixed;
  top: 1rem;
  left: 1rem;
  z-index: 1000;
  background: white;
  border: none;
  padding: 0.5rem;
  border-radius: 0.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  cursor: pointer;

  @media (max-width: 768px) {
    display: block;
  }
`;

const SidebarWrapper = styled.div<{ isOpen: boolean }>`
  @media (max-width: 768px) {
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    transform: translateX(${props => props.isOpen ? '0' : '-100%'});
    transition: transform 0.3s ease-in-out;
    z-index: 999;
  }
`;

const Overlay = styled.div<{ isOpen: boolean }>`
  display: none;
  
  @media (max-width: 768px) {
    display: ${props => props.isOpen ? 'block' : 'none'};
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 998;
  }
`;

export const AppLayout: React.FC<AppLayoutProps> = ({ currentPage, onPageChange, children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isMobile = useMediaQuery('(max-width: 768px)');

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handlePageChangeAndCloseMobileMenu = (page: PageType) => {
    onPageChange(page);
    if (isMobile) {
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <Container>
      <MobileMenuButton onClick={toggleMobileMenu}>
        {isMobileMenuOpen ? '✕' : '☰'}
      </MobileMenuButton>
      
      <Overlay isOpen={isMobileMenuOpen} onClick={() => setIsMobileMenuOpen(false)} />
      
      <SidebarWrapper isOpen={isMobileMenuOpen}>
        <Sidebar 
          currentPage={currentPage} 
          onPageChange={handlePageChangeAndCloseMobileMenu} 
        />
      </SidebarWrapper>

      <MainContent>
        {children}
      </MainContent>
    </Container>
  );
}; 