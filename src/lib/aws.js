import { DeleteObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

const client = new S3Client({
    region: 'us-east-1',
    credentials: {
        accessKeyId:'',
        secretAccessKey: '',
    },
    maxAttempts: 3,
});

const uploadFileToS3 = async (fileName, file) => {
    const command = new PutObjectCommand({
        Bucket: 'rotux',
        Key: fileName,
        Body: file,
    });

    try {
      const response = await client.send(command);
      return response;
    } catch (err) {
      console.error(err);
    }
  };

const deleteFileFromS3 = async (fileName) => {
    const command = new DeleteObjectCommand({
        Bucket: 'rotux',
        Key: fileName,
    });

    try {
        const response = await client.send(command);
        return response;
    } catch (error) {
        console.error('Error al eliminar el archivo:', error);
        throw error;
    }
};

export {
    uploadFileToS3,
    deleteFileFromS3
};
