import React from 'react'
import { Container } from 'react-bootstrap'

export default function Footer(){
  return (
    <footer style={{marginTop:40}}>
      <Container className="text-center small-muted py-3">© {new Date().getFullYear()} UTP — Sistema Académico</Container>
    </footer>
  )
}
