// components/home/CommentsSection.js
'use client'; 
import React, { useState, useEffect } from 'react';
import styles from './CommentsSection.module.css';
import { useCommentRefresh } from '../context/CommentRefreshContext';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL; 

// Componente para renderizar un solo comentario
const CommentCard = ({ comment }) => (
    <div className={styles.commentCard}>
        <p className={styles.commentContent}>"{comment.content}"</p>
        <p className={styles.commentAuthor}>— {comment.name}</p>
        <span className={styles.commentDate}>
            {new Date(comment.createdAt).toLocaleDateString()}
        </span>
    </div>
);

export default function CommentsSection() {
    const [comments, setComments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const { refreshKey } = useCommentRefresh();

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/api/v1/comments`); 
                if (!response.ok) {
                    throw new Error('No se pudieron cargar los comentarios');
                }
                const data = await response.json();
                setComments(data);
            } catch (error) {
                console.error("Error fetching comments:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchComments();
    }, [refreshKey]);

    if (isLoading) return <div className={styles.loadingMessage}>Cargando comentarios...</div>;
    
    // Si no hay comentarios, mostramos un mensaje específico
    if (comments.length === 0) {
        return (
            <section className={styles.commentsSection}>
                <h2 className={styles.sectionTitle}>Lo que dicen nuestros clientes</h2>
                <p className={styles.noCommentsMessage}>Sé el primero en dejar un comentario desde el footer.</p>
            </section>
        );
    }

    return (
        <section className={styles.commentsSection}>
            <h2 className={styles.sectionTitle}>Lo que dicen nuestros clientes</h2>
            
            <div className={styles.commentsGrid}>
                {comments.map(comment => (
                    <CommentCard key={comment.id} comment={comment} />
                ))}
            </div>
        </section>
    );
}