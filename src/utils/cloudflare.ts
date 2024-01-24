export const CLOUDFLARE_WORKER_URL =
  "https://temp-storage.ajpavlick.workers.dev";

export const createCloudflareObject = async (
  cloudflareId: string,
  object: Record<string, any>
): Promise<string> => {
  const requestStr = `${CLOUDFLARE_WORKER_URL}/${cloudflareId}`;
  const resp = await fetch(requestStr, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(object),
  });

  if (resp.status !== 200) {
    console.error("Error creating Cloudflare object:", resp);
    throw new Error("Error creating Cloudflare object");
  } else {
    console.log("Cloudflare object created successfully");
    return requestStr;
  }
};

export const deleteCloudflareObject = async (
  cloudflareId: string
): Promise<void> => {
  const requestStr = `${CLOUDFLARE_WORKER_URL}/template-${cloudflareId}`;
  const resp = await fetch(requestStr, {
    method: "DELETE",
  });

  if (resp.status !== 200) {
    console.error("Error deleting Cloudflare object:", resp);
    throw new Error("Error deleting Cloudflare object");
  } else {
    console.log("Cloudflare object deleted successfully");
  }
};
