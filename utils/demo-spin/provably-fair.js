// provably-fair-frontend.js
export class ProvablyFair {
  static generateServerSeed() {
    return this.generateRandomHex(32);
  }

  static generateClientSeed() {
    return this.generateRandomHex(16);
  }

  static generateRandomHex(bytes) {
    const array = new Uint8Array(bytes);
    crypto.getRandomValues(array);
    return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join(
      ""
    );
  }

  static async hashServerSeed(serverSeed) {
    const encoder = new TextEncoder();
    const data = encoder.encode(serverSeed);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  }

  // static async generateDemoSpinResult(serverSeed, clientSeed, nonce, items) {
  //   console.log(
  //     "🎲 Generating demo spin result (provably fair hash generated but not used)"
  //   );

  //   if (!items || items.length === 0) {
  //     throw new Error("No items available for demo spin");
  //   }

  //   // --- Do the full provably fair hashing like the real method ---
  //   const combined = `${serverSeed}-${clientSeed}-${nonce}`;
  //   const hash = await this.generateHash(combined);

  //   const hexSubstring = hash.substring(0, 8);
  //   const decimal = Number.parseInt(hexSubstring, 16);
  //   const normalized = decimal / 0xffffffff;

  //   // Build odds map exactly like real spins
  //   let cumulativeOdds = 0;
  //   const oddsMap = items.map((item) => {
  //     const range = {
  //       _id: item._id,
  //       slug: item.slug,
  //       item: item.name,
  //       start: cumulativeOdds,
  //       end: cumulativeOdds + item.odd,
  //     };
  //     cumulativeOdds += item.odd;
  //     return range;
  //   });

  //   // --- Ignore the provably fair normalized value ---
  //   // Instead pick a random winning item
  //   const randomIndex = Math.floor(Math.random() * items.length);
  //   const winningItem = items[randomIndex];

  //   console.log("🏆 Demo Winning item (random):", winningItem?.name);

  //   return {
  //     oddsMap,
  //     winningItem,
  //     hash, // still returned for transparency
  //     normalized, // still returned for transparency
  //     verification: {
  //       method: "demo_random",
  //       serverSeed,
  //       clientSeed,
  //       nonce,
  //       hash,
  //       normalized,
  //     },
  //   };
  // }
  static async generateDemoSpinResult(serverSeed, clientSeed, nonce, items) {
    // console.log(
    //   "🎲 Generating demo spin result (provably fair hash generated but not used)"
    // );

    if (!items || items.length === 0) {
      throw new Error("No items available for demo spin");
    }

    // --- Do the full provably fair hashing like the real method ---
    const combined = `${serverSeed}-${clientSeed}-${nonce}`;
    const hash = await this.generateHash(combined);

    const hexSubstring = hash.substring(0, 8);
    const decimal = Number.parseInt(hexSubstring, 16);
    const normalized = decimal / 0xffffffff;

    // Build odds map exactly like real spins
    let cumulativeOdds = 0;
    const oddsMap = items.map((item) => {
      const range = {
        _id: item._id,
        slug: item.slug,
        item: item.name,
        start: cumulativeOdds,
        end: cumulativeOdds + item.odd,
      };
      cumulativeOdds += item.odd;
      return range;
    });

    // --- Pick from top 5 most valuable items ---
    // Sort items by value in descending order
    const sortedItems = [...items].sort((a, b) => {
      const valueA = a.value || 0;
      const valueB = b.value || 0;
      return valueB - valueA; // Descending order
    });

    // Take top 7 (or all if less than 7 items)
    const topItems = sortedItems.slice(0, 7);

    // Pick randomly from top 5
    const randomIndex = Math.floor(Math.random() * topItems.length);
    const winningItem = topItems[randomIndex];

    // console.log(
    //   "🏆 Demo Winning item (from top 7 most valuable):",
    //   winningItem?.name
    // );
    // console.log(
    //   "💰 Top7 items considered:",
    //   topItems.map((item) => ({
    //     name: item.name,
    //     value: item.value,
    //   }))
    // );

    return {
      oddsMap,
      winningItem,
      hash, // still returned for transparency
      normalized, // still returned for transparency
      verification: {
        method: "demo_random_top5",
        serverSeed,
        clientSeed,
        nonce,
        hash,
        normalized,
        note: "Winning item picked randomly from top 5 most valuable items",
      },
    };
  }

  static async generateHash(input) {
    const encoder = new TextEncoder();
    const data = encoder.encode(input);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  }

  static async verifyResult(serverSeed, clientSeed, nonce, expectedHash) {
    const combined = `${serverSeed}-${clientSeed}-${nonce}`;
    const hash = await this.generateHash(combined);
    return hash === expectedHash;
  }
}
