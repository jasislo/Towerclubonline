/**
 * Profile Picture API - Netlify Serverless Function
 * Handles profile picture operations for static hosting
 */

const { v4: uuidv4 } = require('uuid');

exports.handler = async (event, context) => {
    // Enable CORS
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
    };

    // Handle preflight requests
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers,
            body: ''
        };
    }

    try {
        const { httpMethod, path, body, queryStringParameters } = event;
        const pathSegments = path.split('/').filter(Boolean);
        
        // Extract the operation from the path
        const operation = pathSegments[pathSegments.length - 1];
        const userId = queryStringParameters?.userId || (body ? JSON.parse(body).userId : null);

        switch (httpMethod) {
            case 'POST':
                if (operation === 'upload-picture') {
                    return handleUploadPicture(event, headers);
                } else if (operation === 'sync-picture') {
                    return handleSyncPicture(event, headers);
                }
                break;
                
            case 'GET':
                if (operation === 'picture') {
                    return handleGetPicture(event, headers);
                } else if (operation === 'picture-history') {
                    return handleGetPictureHistory(event, headers);
                }
                break;
                
            case 'PUT':
                if (operation === 'update-picture') {
                    return handleUpdatePicture(event, headers);
                }
                break;
                
            case 'DELETE':
                if (operation === 'delete-picture') {
                    return handleDeletePicture(event, headers);
                }
                break;
        }

        return {
            statusCode: 404,
            headers,
            body: JSON.stringify({ error: 'Endpoint not found' })
        };

    } catch (error) {
        console.error('Profile picture API error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'Internal server error' })
        };
    }
};

/**
 * Handle profile picture upload
 */
async function handleUploadPicture(event, headers) {
    try {
        const body = JSON.parse(event.body);
        const { userId, base64Image, filename } = body;

        if (!userId || !base64Image) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'User ID and image data are required' })
            };
        }

        // Generate unique filename if not provided
        const uniqueFilename = filename || `${uuidv4()}-${Date.now()}.jpg`;
        
        // Create profile picture data
        const profilePictureData = {
            userId: userId,
            filename: uniqueFilename,
            base64Image: base64Image,
            uploadDate: new Date().toISOString(),
            isActive: true,
            fileSize: Math.round(base64Image.length * 0.75), // Approximate size
            mimeType: 'image/jpeg'
        };

        // In a real implementation, you would save to a database
        // For now, we'll return success with the data
        const userData = {
            userId: userId,
            profilePicture: uniqueFilename,
            profilePictureData: base64Image,
            updatedAt: new Date().toISOString()
        };

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                message: 'Profile picture uploaded successfully',
                filename: uniqueFilename,
                user: userData
            })
        };

    } catch (error) {
        console.error('Upload error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'Failed to upload profile picture' })
        };
    }
}

/**
 * Handle getting profile picture
 */
async function handleGetPicture(event, headers) {
    try {
        const { userId } = event.queryStringParameters || {};

        if (!userId) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'User ID is required' })
            };
        }

        // In a real implementation, you would fetch from database
        // For now, return a mock response
        const mockUserData = {
            userId: userId,
            profilePicture: 'default-avatar.jpg',
            profilePicturePath: '/uploads/profile-pictures/default-avatar.jpg'
        };

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                profilePicture: mockUserData.profilePicture,
                profilePicturePath: mockUserData.profilePicturePath
            })
        };

    } catch (error) {
        console.error('Get picture error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'Failed to fetch profile picture' })
        };
    }
}

/**
 * Handle updating profile picture
 */
async function handleUpdatePicture(event, headers) {
    try {
        const body = JSON.parse(event.body);
        const { userId, profilePicture, updatedAt } = body;

        if (!userId) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'User ID is required' })
            };
        }

        // In a real implementation, you would update the database
        const updatedUser = {
            userId: userId,
            profilePicture: profilePicture,
            updatedAt: updatedAt || new Date().toISOString()
        };

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                message: 'Profile picture updated successfully',
                user: updatedUser
            })
        };

    } catch (error) {
        console.error('Update error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'Failed to update profile picture' })
        };
    }
}

/**
 * Handle deleting profile picture
 */
async function handleDeletePicture(event, headers) {
    try {
        const body = JSON.parse(event.body);
        const { userId } = body;

        if (!userId) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'User ID is required' })
            };
        }

        // In a real implementation, you would delete from database
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                message: 'Profile picture deleted successfully'
            })
        };

    } catch (error) {
        console.error('Delete error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'Failed to delete profile picture' })
        };
    }
}

/**
 * Handle syncing profile picture across sessions
 */
async function handleSyncPicture(event, headers) {
    try {
        const body = JSON.parse(event.body);
        const { userId, profilePicture, syncTimestamp } = body;

        if (!userId) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'User ID is required' })
            };
        }

        // In a real implementation, you would sync across sessions
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                message: 'Profile picture synced successfully',
                syncTimestamp: syncTimestamp
            })
        };

    } catch (error) {
        console.error('Sync error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'Failed to sync profile picture' })
        };
    }
}

/**
 * Handle getting profile picture history
 */
async function handleGetPictureHistory(event, headers) {
    try {
        const { userId } = event.queryStringParameters || {};

        if (!userId) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'User ID is required' })
            };
        }

        // In a real implementation, you would fetch history from database
        const mockHistory = [
            {
                id: '1',
                userId: userId,
                filename: 'profile-1.jpg',
                uploadDate: new Date().toISOString(),
                isActive: false
            },
            {
                id: '2',
                userId: userId,
                filename: 'profile-2.jpg',
                uploadDate: new Date().toISOString(),
                isActive: true
            }
        ];

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                history: mockHistory
            })
        };

    } catch (error) {
        console.error('History error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'Failed to fetch picture history' })
        };
    }
}