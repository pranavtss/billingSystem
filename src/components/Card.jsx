import React from 'react';

const Card = ({ title, content, image, footer }) => (
    <div style={{
        border: '1px solid #ddd',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        padding: '16px',
        maxWidth: '320px',
        background: '#fff'
    }}>
        {image && (
            <img
                src={image}
                alt={title}
                style={{ width: '100%', borderRadius: '6px 6px 0 0', marginBottom: '12px' }}
            />
        )}
        {title && (
            <h3 style={{ margin: '0 0 8px 0', fontSize: '1.25rem' }}>{title}</h3>
        )}
        <div style={{ marginBottom: '12px', color: '#555' }}>
            {content}
        </div>
        {footer && (
            <div style={{ borderTop: '1px solid #eee', paddingTop: '8px', color: '#888', fontSize: '0.9rem' }}>
                {footer}
            </div>
        )}
    </div>
);

export default Card;