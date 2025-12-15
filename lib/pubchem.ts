/**
 * PubChem API utilities for fetching molecular data
 */

export interface PubChemCIDResponse {
    IdentifierList: {
        CID: number[]
    }
}

export interface CompoundProperties {
    MolecularFormula?: string
    MolecularWeight?: string
    IUPACName?: string
    CanonicalSMILES?: string
    InChI?: string
    InChIKey?: string
    Title?: string
    Description?: string
}

export interface MoleculeData {
    cid: number
    sdfData: string
    moleculeName: string
    properties?: CompoundProperties
}

/**
 * Fetch the PubChem Compound ID (CID) for a molecule by name
 * @param moleculeName - The name of the molecule (e.g., "Atorvastatin")
 * @returns The CID or null if not found
 */
export async function fetchPubChemCID(moleculeName: string): Promise<number | null> {
    try {
        const response = await fetch(
            `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/${encodeURIComponent(moleculeName)}/cids/JSON`
        )

        if (!response.ok) {
            console.error(`Failed to fetch CID for ${moleculeName}:`, response.statusText)
            return null
        }

        const data: PubChemCIDResponse = await response.json()

        if (data.IdentifierList?.CID && data.IdentifierList.CID.length > 0) {
            return data.IdentifierList.CID[0]
        }

        return null
    } catch (error) {
        console.error(`Error fetching CID for ${moleculeName}:`, error)
        return null
    }
}

/**
 * Fetch the 3D structure in SDF format for a molecule by CID
 * @param cid - The PubChem Compound ID
 * @returns The SDF data as a string or null if not found
 */
export async function fetchPubChemSDF(cid: number): Promise<string | null> {
    try {
        const response = await fetch(
            `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${cid}/SDF`
        )

        if (!response.ok) {
            console.error(`Failed to fetch SDF for CID ${cid}:`, response.statusText)
            return null
        }

        const sdfData = await response.text()
        return sdfData
    } catch (error) {
        console.error(`Error fetching SDF for CID ${cid}:`, error)
        return null
    }
}

/**
 * Fetch compound properties from PubChem
 * @param cid - The PubChem Compound ID
 * @returns CompoundProperties object or null if not found
 */
export async function fetchCompoundProperties(cid: number): Promise<CompoundProperties | null> {
    try {
        const response = await fetch(
            `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${cid}/property/MolecularFormula,MolecularWeight,IUPACName,CanonicalSMILES,InChI,InChIKey,Title/JSON`
        )

        if (!response.ok) {
            console.error(`Failed to fetch properties for CID ${cid}:`, response.statusText)
            return null
        }

        const data = await response.json()

        if (data.PropertyTable?.Properties && data.PropertyTable.Properties.length > 0) {
            const props = data.PropertyTable.Properties[0]
            return {
                MolecularFormula: props.MolecularFormula,
                MolecularWeight: props.MolecularWeight?.toString(),
                IUPACName: props.IUPACName,
                CanonicalSMILES: props.CanonicalSMILES,
                InChI: props.InChI,
                InChIKey: props.InChIKey,
                Title: props.Title
            }
        }

        return null
    } catch (error) {
        console.error(`Error fetching properties for CID ${cid}:`, error)
        return null
    }
}

/**
 * Fetch complete molecule data (CID + SDF + Properties) for a molecule by name
 * @param moleculeName - The name of the molecule
 * @returns MoleculeData object or null if not found
 */
export async function fetchMoleculeData(moleculeName: string): Promise<MoleculeData | null> {
    try {
        // Step 1: Get the CID
        const cid = await fetchPubChemCID(moleculeName)

        if (!cid) {
            console.error(`Could not find CID for molecule: ${moleculeName}`)
            return null
        }

        // Step 2: Get the SDF data and properties in parallel
        const [sdfData, properties] = await Promise.all([
            fetchPubChemSDF(cid),
            fetchCompoundProperties(cid)
        ])

        if (!sdfData) {
            console.error(`Could not fetch SDF data for CID: ${cid}`)
            return null
        }

        return {
            cid,
            sdfData,
            moleculeName,
            properties: properties || undefined
        }
    } catch (error) {
        console.error(`Error fetching molecule data for ${moleculeName}:`, error)
        return null
    }
}
