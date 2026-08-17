import React from 'react'
import { Card, Button } from 'react-bootstrap'

export default function Hero({ onNavigate }){
  return (
    <Card className="card-custom mb-3 hero-card p-3">
      <div style={{display:'flex',alignItems:'center',gap:20}}>
        <div style={{flex:1}}>
          <h2 style={{color:'#fff',marginTop:0}}>Bienvenido al portal estudiantil</h2>
          <p style={{color:'#f0eefe'}}>Accede a tus cursos, horarios y calificaciones en un solo lugar.</p>
          <Button variant="light" onClick={() => onNavigate && onNavigate('horarios')}>Ver mi horario</Button>
        </div>
        <div style={{width:360,height:140,background:'url(https://picsum.photos/360/140) center/cover',borderRadius:8}} />
      </div>
    </Card>
  )
}
