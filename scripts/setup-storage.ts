import {
  CreateBucketCommand,
  HeadBucketCommand,
  PutBucketPolicyCommand,
  S3Client,
} from "@aws-sdk/client-s3";

const S3_BUCKET = process.env.S3_BUCKET!;

const s3 = new S3Client({
  region: process.env.S3_REGION,
  endpoint: process.env.S3_ENDPOINT,
  forcePathStyle: process.env.S3_FORCE_PATH_STYLE === "true",
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID!,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
  },
});

async function main() {
  try {
    await s3.send(new HeadBucketCommand({ Bucket: S3_BUCKET }));
    console.log(`Bucket "${S3_BUCKET}" zaten mevcut.`);
  } catch {
    await s3.send(new CreateBucketCommand({ Bucket: S3_BUCKET }));
    console.log(`Bucket "${S3_BUCKET}" olusturuldu.`);
  }

  const publicReadPolicy = {
    Version: "2012-10-17",
    Statement: [
      {
        Effect: "Allow",
        Principal: "*",
        Action: ["s3:GetObject"],
        Resource: [`arn:aws:s3:::${S3_BUCKET}/*`],
      },
    ],
  };

  await s3.send(
    new PutBucketPolicyCommand({
      Bucket: S3_BUCKET,
      Policy: JSON.stringify(publicReadPolicy),
    })
  );
  console.log("Bucket public-read politikasi ayarlandi.");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
