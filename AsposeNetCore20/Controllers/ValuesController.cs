using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Aspose.Pdf;
using Aspose.Pdf.Facades;
using AsposeNetCore20.Model;
using Microsoft.AspNetCore.Mvc;

namespace AsposeNetCore20.Controllers
{
	[Route("api/values")]
	[ApiController]
	public class ValuesController : ControllerBase
	{
		private const string outputDir = @"C:\AsposePDF\Files\";
		private const string outputConcDir = @"C:\AsposePDF\Concatenated\";
		// GET api/values
		[HttpGet]
		public ActionResult<string> Get()
		{
			return "File Created";
		}

		// GET api/values/5
		[HttpGet("{id}")]
		public ActionResult<string> Get(int id)
		{
			return "value";
		}

		// POST api/values
		[HttpPost]
		[Route("CreateFile")]
		public ActionResult<string> CreateFile([FromBody] Request request)
		{
			System.IO.Directory.CreateDirectory(outputDir);

			Document document = new Document();
			Page page = document.Pages.Add();

			page.Paragraphs.Add(new Aspose.Pdf.Text.TextFragment(request.filetext));
			document.Save(outputDir + request.filename + ".pdf");

			return "File Created Successfully";
		}

		[HttpPost]
		[Route("Concatenate")]
		public ActionResult<string> Concatenate([FromBody] Request request)
		{
			System.IO.Directory.CreateDirectory(outputConcDir);

			PdfFileEditor pdfEditor = new PdfFileEditor();

			List<System.IO.Stream> pdfStreams = new List<System.IO.Stream>();
			string[] files  = System.IO.Directory.GetFiles(outputDir);
			foreach(string file in files)
			{
				System.IO.FileStream stream = new System.IO.FileStream(file, System.IO.FileMode.Open);
				pdfStreams.Add(stream);
			}

			System.IO.FileStream outputPDF = new System.IO.FileStream(outputConcDir + request.filename + ".pdf", System.IO.FileMode.Create);

			pdfEditor.Concatenate(pdfStreams.ToArray(), outputPDF );
			outputPDF.Close();

			return "Files Concatenated Successfully";
		}

		[HttpPost]
		[Route("ConcatenateWithContents")]
		public ActionResult<string> ConcatenateWithContents([FromBody] Request request)
		{
			System.IO.Directory.CreateDirectory(outputConcDir);

			PdfFileEditor pdfEditor = new PdfFileEditor();

			using (MemoryStream Concatenated_Stream = new MemoryStream())
			{

				List<System.IO.Stream> pdfStreams = new List<System.IO.Stream>();
				string[] files = System.IO.Directory.GetFiles(outputDir);
				foreach (string file in files)
				{
					System.IO.FileStream stream = new System.IO.FileStream(file, System.IO.FileMode.Open);
					pdfStreams.Add(stream);
				}

				System.IO.FileStream outputPDF = new System.IO.FileStream(outputConcDir + request.filename + ".pdf", System.IO.FileMode.Create);

				pdfEditor.Concatenate(pdfStreams.ToArray(), Concatenated_Stream);

				// Insert a blank page at the begining of concatenated file to display Table of Contents
				Aspose.Pdf.Document concatenated_pdfDocument = new Aspose.Pdf.Document(Concatenated_Stream);
				// Insert a empty page in a PDF
				concatenated_pdfDocument.Pages.Insert(1);

				using (MemoryStream Document_With_BlankPage = new MemoryStream())
				{

					// Save output file
					concatenated_pdfDocument.Save(Document_With_BlankPage);

					using (var Document_with_TOC_Heading = new MemoryStream())
					{
						// Add Table Of Contents logo as stamp to PDF file
						PdfFileStamp fileStamp = new PdfFileStamp();
						// Find the input file
						fileStamp.BindPdf(Document_With_BlankPage);

						// Set Text Stamp to display string Table Of Contents
						Aspose.Pdf.Facades.Stamp stamp = new Aspose.Pdf.Facades.Stamp();
						stamp.BindLogo(new FormattedText("Table Of Contents", System.Drawing.Color.Maroon, System.Drawing.Color.Transparent, Aspose.Pdf.Facades.FontStyle.Helvetica, EncodingType.Winansi, true, 18));
						// Specify the origin of Stamp. We are getting the page width and specifying the X coordinate for stamp
						stamp.SetOrigin((new PdfFileInfo(Document_With_BlankPage).GetPageWidth(1) / 3), 700);
						// Set particular pages
						stamp.Pages = new int[] { 1 };
						// Add stamp to PDF file
						fileStamp.AddStamp(stamp);

						int counter = 1;
						int diff = 0;
						foreach (System.IO.Stream stream in pdfStreams)
						{
							var Document_Link = new Aspose.Pdf.Facades.Stamp();
							Document_Link.BindLogo(new FormattedText(counter + " - Link to Document " + counter, System.Drawing.Color.Black, System.Drawing.Color.Transparent, Aspose.Pdf.Facades.FontStyle.Helvetica, EncodingType.Winansi, true, 12));
							Document_Link.SetOrigin(150, 650 - diff);
							Document_Link.Pages = new int[] { 1 };
							fileStamp.AddStamp(Document_Link);
							counter++;
							diff += 40;
						}

						fileStamp.Save(Document_with_TOC_Heading);
						fileStamp.Close();

						PdfContentEditor contentEditor = new PdfContentEditor();
						// Bind the PDF file in which we added the blank page
						contentEditor.BindPdf(Document_with_TOC_Heading);

						counter = 1;
						diff = 0;
						foreach (System.IO.Stream stream in pdfStreams)
						{
							contentEditor.CreateLocalLink(new System.Drawing.Rectangle(150, 650 - diff, 100, 20), counter +1, 1, System.Drawing.Color.Transparent);
							counter++;
							diff += 40;
						}

						contentEditor.Save(outputConcDir + "Concatenated_Table_Of_Contents.pdf");
					}
				}
			}

			return "Files Concatenated Successfully with Talbe Of Contents";
		}

		// PUT api/values/5
		[HttpPut("{id}")]
		public void Put(int id, [FromBody] string value)
		{
		}

		// DELETE api/values/5
		[HttpDelete("{id}")]
		public void Delete(int id)
		{
		}
	}
}
