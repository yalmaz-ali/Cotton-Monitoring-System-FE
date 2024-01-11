import React from 'react';

const NotFoundPage = () => {
    return (
        <div style={styles.container}>
            <img
                src="https://mir-s3-cdn-cf.behance.net/project_modules/1400/81b78f10286437.560e2646654e5.jpg"
                alt="Creative 404 Illustration"
                style={styles.image}
            />
        </div>
    );
};

const styles = {
    container: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    image: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
    },
};

export default NotFoundPage;