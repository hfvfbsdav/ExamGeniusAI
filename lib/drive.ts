import { google } from "googleapis";

const SCOPES = ["https://www.googleapis.com/auth/drive"];
const ROOT_FOLDER = process.env.GOOGLE_DRIVE_ROOT_FOLDER ?? "AI-Genius-Books";

function getAuth() {
  const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const privateKey = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (!clientEmail || !privateKey) {
    return null;
  }

  return new google.auth.JWT({
    email: clientEmail,
    key: privateKey,
    scopes: SCOPES
  });
}

export async function ensureClassFolder(className: string) {
  const auth = getAuth();
  if (!auth) return { folderId: `mock-folder-${className}`, source: "mock" };

  const drive = google.drive({ version: "v3", auth });
  const query = `name='${className}' and mimeType='application/vnd.google-apps.folder' and trashed=false`;
  const existing = await drive.files.list({ q: query, fields: "files(id, name)" });

  if (existing.data.files?.[0]?.id) {
    return { folderId: existing.data.files[0].id, source: "drive" };
  }

  const created = await drive.files.create({
    requestBody: {
      name: className,
      mimeType: "application/vnd.google-apps.folder"
    },
    fields: "id"
  });

  return { folderId: created.data.id ?? ROOT_FOLDER, source: "drive" };
}

export async function uploadPdfToDrive(fileName: string, fileBuffer: Buffer, className: string) {
  const auth = getAuth();
  if (!auth) {
    return { fileId: `mock-file-${Date.now()}`, webViewLink: "https://drive.google.com", source: "mock" };
  }

  const drive = google.drive({ version: "v3", auth });
  const { folderId } = await ensureClassFolder(`class${className}`);

  const uploaded = await drive.files.create({
    requestBody: {
      name: fileName,
      parents: [folderId],
      mimeType: "application/pdf"
    },
    media: {
      mimeType: "application/pdf",
      body: Buffer.from(fileBuffer)
    },
    fields: "id, webViewLink"
  });

  return {
    fileId: uploaded.data.id ?? "",
    webViewLink: uploaded.data.webViewLink ?? "",
    source: "drive"
  };
}
