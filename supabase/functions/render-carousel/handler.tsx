import satori from "satori";
import { Resvg } from "@resvg/resvg-wasm";
import { PDFDocument } from "pdf-lib";

/* 
 * FONT LOADING STRATEGY
 * We load fonts from Google Fonts CDN as ArrayBuffers. 
 * This is efficient for Edge Functions.
 */
async function loadFont(fontFamily: string, weight: number = 400) {
    const url = `https://fonts.googleapis.com/css2?family=${fontFamily}:wght@${weight}&text=abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+=-[]{};:'",.<>/?`;
    const css = await fetch(url).then((res) => res.text());
    const match = css.match(/src: url\((.+?)\) format\('(opentype|truetype|woff)'\)/) || css.match(/src: url\((.+?)\)/);
    
    if (!match) throw new Error("Failed to parse font URL");
    
    return await fetch(match[1]).then((res) => res.arrayBuffer());
}

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

export const handler = async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: CORS_HEADERS });
  }

  try {
    const { slides, design, author, format = 'pdf' } = await req.json();

    if (!slides || !design) {
        throw new Error("Missing required fields: slides, design");
    }

    // 1. Load Fonts (Parallel)
    // For MVP, we load Inter and maybe the specific heading font requested
    const fontDataRegular = await loadFont('Inter');
    const fontDataBold = await loadFont('Inter', 700);
    
    // We could dynamically load based on design.fonts.heading, but let's stick to Inter for safety/speed first
    // or add a map of supported fonts.
    
    const width = 1080;
    const height = design.aspectRatio === '4:5' ? 1350 : design.aspectRatio === '9:16' ? 1920 : 1080;

    const images: Uint8Array[] = [];

    // 2. Render Loop
    for (const slide of slides) {
        // Construct the JSX for the slide (Simplified version of SlideRenderer logic)
        // Note: satori requires standard flexbox styles in style prop.
        const element = (
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                height: '100%',
                backgroundColor: design.colorPalette.background,
                padding: 60,
                position: 'relative',
            }}>
                {/* Background Pattern Mock */}
                {design.background.patternType === 'dots' && (
                    <div style={{
                        position: 'absolute',
                        top: 0, 
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundImage: `radial-gradient(${design.background.patternColor} 1px, transparent 1px)`,
                        backgroundSize: '40px 40px',
                        opacity: design.background.patternOpacity,
                        zIndex: 0
                    }} />
                )}

                {/* Content */}
                <div style={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    height: '100%', 
                    zIndex: 10,
                    justifyContent: slide.type === 'intro' ? 'center' : 'flex-start'
                }}>
                    <h1 style={{ 
                        fontSize: slide.type === 'intro' ? 80 : 64, 
                        color: design.colorPalette.primary,
                        fontFamily: 'Inter',
                        fontWeight: 700,
                        marginBottom: 40
                    }}>
                        {slide.content.title}
                    </h1>
                    
                    {slide.content.image_url && (
                        <img 
                            src={slide.content.image_url} 
                            style={{ 
                                width: '100%', 
                                height: 400, 
                                objectFit: 'cover', 
                                borderRadius: 20, 
                                marginBottom: 40 
                            }} 
                        />
                    )}

                    <p style={{ 
                        fontSize: 36, 
                        color: design.colorPalette.text, 
                        fontFamily: 'Inter',
                        lineHeight: 1.4
                    }}>
                        {slide.content.body}
                    </p>
                </div>

                {/* Footer */}
                <div style={{
                    position: 'absolute',
                    bottom: 40,
                    left: 60,
                    right: 60,
                    display: 'flex',
                    justifyContent: 'space-between',
                    zIndex: 20
                }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                         <span style={{ fontSize: 24, fontWeight: 700, color: design.colorPalette.text }}>{author.handle}</span>
                    </div>
                </div>
            </div>
        );

        // Convert JSX to SVG (Satori)
        const svg = await satori(element, {
            width,
            height,
            fonts: [
                {
                    name: 'Inter',
                    data: fontDataRegular,
                    weight: 400,
                    style: 'normal',
                },
                {
                    name: 'Inter',
                    data: fontDataBold,
                    weight: 700,
                    style: 'normal',
                },
            ],
        });

        // Convert SVG to PNG (Resvg)
        const resvg = new Resvg(svg);
        const pngData = resvg.render();
        const pngBuffer = pngData.asPng();
        images.push(pngBuffer);
    }

    // 3. Output Format
    if (format === 'zip') {
        // Zip implementation (omitted for brevity, requires JSZip)
        return new Response("Zip not supported yet, request pdf", { status: 400, headers: CORS_HEADERS });
    } 
    else {
        // Create PDF
        const pdfDoc = await PDFDocument.create();
        for (const pngBuffer of images) {
            const pngImage = await pdfDoc.embedPng(pngBuffer);
            const page = pdfDoc.addPage([width, height]);
            page.drawImage(pngImage, {
                x: 0,
                y: 0,
                width,
                height,
            });
        }
        
        const pdfBytes = await pdfDoc.save();

        return new Response(new Blob([pdfBytes as unknown as BlobPart]), {
            headers: { 
                ...CORS_HEADERS,
                "Content-Type": "application/pdf",
                "Content-Disposition": `attachment; filename="carousel-export.pdf"`
            },
        });
    }

  } catch (error: unknown) {
    console.error(error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    });
  }
};
