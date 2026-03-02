import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: "dzqzd0o0a",
  api_key: process.env.CLOUDINARY_API_KEY || "479449845145258",
  api_secret: process.env.CLOUDINARY_API_SECRET || "qPpvnwGeVcYmm1145WvZ3_MxZm8",
});

async function getBlueDiamonds() {
  try {
    console.log("🔍 Fetching assets from Cloudinary...");
    console.log("   Cloud name:", cloudinary.config().cloud_name);
    
    let result = null;
    let usedPrefix = null;

    // First, try to get all resources with "blue diamonds" in the path
    // This works for both upload folders and Media Library
    const prefixes = [
      "blue diamonds/",
      "blue-diamonds/",
      "Blue Diamonds/",
      "Blue-Diamonds/",
    ];

    for (const prefix of prefixes) {
      try {
        console.log(`   Trying prefix: "${prefix}"`);
        result = await cloudinary.api.resources({
          type: "upload",
          prefix: prefix,
          max_results: 500,
          resource_type: "image"
        });
        
        if (result.resources && result.resources.length > 0) {
          usedPrefix = prefix;
          console.log(`   ✅ Found ${result.resources.length} assets with prefix "${prefix}"`);
          break;
        } else {
          console.log(`   ❌ No assets found with prefix "${prefix}"`);
        }
      } catch (err) {
        console.log(`   ❌ Error with prefix "${prefix}":`, err.message);
      }
    }

    // If no results, try searching all resources and filter by folder name
    if (!result || !result.resources || result.resources.length === 0) {
      console.log("\n   Trying to search all resources and filter by 'blue diamonds' folder...");
      try {
        // Get all resources and filter
        result = await cloudinary.api.resources({
          type: "upload",
          max_results: 1000,
          resource_type: "image"
        });
        
        if (result.resources && result.resources.length > 0) {
          // Filter resources that contain "blue diamonds" in their path
          const filtered = result.resources.filter(asset => {
            const path = asset.public_id.toLowerCase();
            const folder = asset.folder?.toLowerCase() || "";
            return path.includes("blue diamonds") || 
                   path.includes("blue-diamonds") ||
                   folder.includes("blue diamonds") ||
                   folder.includes("blue-diamonds");
          });
          
          if (filtered.length > 0) {
            result.resources = filtered;
            usedPrefix = "filtered from all resources";
            console.log(`   ✅ Found ${filtered.length} assets in "blue diamonds" folder`);
          } else {
            console.log(`   ⚠️  Found ${result.resources.length} total assets, but none in "blue diamonds" folder`);
            console.log("   Sample public_ids (first 5):");
            result.resources.slice(0, 5).forEach(asset => {
              console.log(`     - ${asset.public_id} (folder: ${asset.folder || "none"})`);
            });
          }
        }
      } catch (err) {
        console.log(`   Error searching all resources:`, err.message);
      }
    }

    if (!result || !result.resources || result.resources.length === 0) {
      console.log("\n⚠️  No assets found. Listing available folders...");
      try {
        const folders = await cloudinary.api.root_folders();
        console.log("   Available root folders:", folders.folders?.map(f => f.name) || "none");
        
        // Try to get resources without prefix filter
        console.log("\n   Trying to get all image resources...");
        result = await cloudinary.api.resources({
          type: "upload",
          max_results: 200,
          resource_type: "image"
        });
        
        if (result.resources && result.resources.length > 0) {
          console.log(`   Found ${result.resources.length} total image resources`);
          console.log("   Sample public_ids (first 5):");
          result.resources.slice(0, 5).forEach(asset => {
            console.log(`     - ${asset.public_id}`);
          });
        }
      } catch (err) {
        console.log("   Could not list resources:", err.message);
      }
      throw new Error("No assets found in 'blue diamonds' folder");
    }

    const mapping = {};

    result.resources.forEach((asset) => {
      const filename = asset.public_id.split("/").pop();
      // Remove random suffix if present (e.g., "IMG_5340_tef5d9" -> "IMG_5340")
      const originalName = filename.replace(/_[a-z0-9]+$/, "");

      // If asset doesn't have "blue diamonds" in path, add it
      let publicId = asset.public_id;
      if (!publicId.toLowerCase().includes("blue diamonds") && !publicId.toLowerCase().includes("blue-diamonds")) {
        publicId = `blue diamonds/${publicId}`;
      }

      mapping[originalName] = publicId;
    });

    // Write to both root and public folder
    const mappingJson = JSON.stringify(mapping, null, 2);
    fs.writeFileSync("blue-diamonds-mapping.json", mappingJson);
    fs.writeFileSync("public/blue-diamonds-mapping.json", mappingJson);

    console.log(`\n✅ Mapping generated successfully!`);
    console.log(`   Total assets: ${Object.keys(mapping).length}`);
    console.log(`   Used prefix: "${usedPrefix}"`);
    console.log("\n📋 Sample mappings (first 10):");
    Object.entries(mapping).slice(0, 10).forEach(([key, value]) => {
      console.log(`   ${key} -> ${value}`);
    });
  } catch (error) {
    console.error("\n❌ Error generating mapping:", error.message);
    if (error.http_code) {
      console.error(`   HTTP Code: ${error.http_code}`);
    }
    if (error.message.includes("401") || error.http_code === 401) {
      console.error("   ⚠️  Authentication failed. Check your API credentials.");
    }
    process.exit(1);
  }
}

getBlueDiamonds();
