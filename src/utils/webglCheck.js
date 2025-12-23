// Check if WebGL is available and working
export const checkWebGL = () => {
  try {
    const canvas = document.createElement("canvas");
    const gl =
      canvas.getContext("webgl") || canvas.getContext("experimental-webgl");

    if (!gl) {
      console.error("WebGL not supported");
      return false;
    }

    // Check for specific extensions needed by HERE Maps
    const requiredExtensions = [
      "OES_texture_float",
      "OES_texture_float_linear",
      "WEBGL_compressed_texture_s3tc",
    ];

    const missingExtensions = requiredExtensions.filter(
      (ext) => !gl.getExtension(ext)
    );

    if (missingExtensions.length > 0) {
      console.warn("Missing WebGL extensions:", missingExtensions);
    }

    return true;
  } catch (error) {
    console.error("WebGL check failed:", error);
    return false;
  }
};

// Check if browser supports necessary features
export const checkBrowserSupport = () => {
  const issues = [];

  if (!window.Promise) {
    issues.push("Promises not supported");
  }

  if (!window.fetch) {
    issues.push("Fetch API not supported");
  }

  if (!window.URL || !window.URL.createObjectURL) {
    issues.push("URL API not supported");
  }

  const webglSupported = checkWebGL();
  if (!webglSupported) {
    issues.push("WebGL not supported or disabled");
  }

  return {
    supported: issues.length === 0,
    issues,
  };
};
