import React from 'react';
import { C, Card } from './Common';
import Icon from './Icon';

const projects = [
  { 
    date: '28 July 2022', 
    title: 'Manifesto dell\'abitare', 
    desc: 'Litelab joins the Manifesto, focusing on the quality of relationships and innovation from domestic walls to the discovery of neighborhoods.' 
  },
  { 
    date: '28 June 2021', 
    title: 'Amazon Logistics | Italy', 
    desc: 'Supporting the Climate Pledge for zero CO2 emissions by 2040. A massive 189,000 m2 sustainable lighting project.' 
  },
  { 
    date: '6 July 2022', 
    title: 'Civic Archaeological Museum', 
    desc: 'Bologna. Adjusting projection for Etruscan, Italic, Greek, and Roman collections.' 
  },
  { 
    date: 'January 2020', 
    title: 'Schneiberg Museum', 
    desc: 'Torino. Installation of a special 7.2 x 10.6 m suspended structure in the main hall.' 
  }
];

export const LitelabHeritage = () => (
  <section style={{ padding: '80px 0', borderTop: `1px solid ${C.border}` }}>
    <div style={{ maxWidth: 1000, margin: '0 auto', textAlign: 'center', marginBottom: 64 }}>
      <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 32, fontWeight: 800, color: C.text, marginBottom: 16 }}>Our Heritage</h2>
      <p style={{ fontSize: 18, color: C.muted, lineHeight: 1.6, maxWidth: 700, margin: '0 auto' }}>
        LiteRight Academy is built on the foundation of <strong>Litelab Milano</strong>—a global leader in architectural lighting and residential innovation.
      </p>
    </div>

    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 32, maxWidth: 1200, margin: '0 auto', padding: '0 32px' }}>
      <div style={{ gridColumn: '1 / -1', marginBottom: 40 }}>
        <div style={{ background: C.accent, color: '#fff', padding: '40px', borderRadius: 24, textAlign: 'left', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', right: -40, top: -40, opacity: 0.1 }}><Icon name="lightbulb" size={240} color="#fff" /></div>
          <h3 style={{ fontSize: 24, fontWeight: 800, marginBottom: 16 }}>The Manifesto dell'abitare</h3>
          <p style={{ fontSize: 16, lineHeight: 1.7, opacity: 0.9, maxWidth: 640 }}>
            "We want to measure living not only in square meters, but in quality of relationships, starting from the domestic walls up to the discovery of the neighborhood."
            <br /><br />
            LiteRight Academy brings this philosophy to education, teaching you to design spaces that breathe, connect, and inspire.
          </p>
        </div>
      </div>

      {projects.map((p, i) => (
        <Card key={i} style={{ border: 'none', background: '#fff', boxShadow: '0 10px 30px rgba(0,0,0,0.03)' }}>
          <div style={{ color: C.accent, fontSize: 12, fontWeight: 700, marginBottom: 8, textTransform: 'uppercase' }}>{p.date}</div>
          <h4 style={{ fontSize: 18, fontWeight: 700, marginBottom: 12, color: C.text }}>{p.title}</h4>
          <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.6 }}>{p.desc}</p>
        </Card>
      ))}
    </div>

    <div style={{ marginTop: 80, padding: '40px 32px', background: C.surface, textAlign: 'center' }}>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 48, flexWrap: 'wrap' }}>
        {['Milano, Italia', 'Chennai, India', 'Bengaluru, India'].map(loc => (
          <div key={loc} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Icon name="map-pin" size={16} color={C.accent} />
            <span style={{ fontWeight: 600, color: C.text }}>{loc}</span>
          </div>
        ))}
      </div>
    </div>
  </section>
);
