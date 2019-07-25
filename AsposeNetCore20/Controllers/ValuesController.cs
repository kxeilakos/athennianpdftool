using System;
using System.Collections.Generic;
using System.Web;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using Aspose.Pdf;
using Aspose.Pdf.Facades;
using AsposeNetCore20.Model;
using Microsoft.AspNetCore.Mvc;
using System.IO;
using System.Net.Http.Headers;

namespace AsposeNetCore20.Controllers
{
	[Route("api/values")]
	[ApiController]
	public class ValuesController : ControllerBase
	{
		private const string outputDir = @"C:\AsposePDF\Files\";
		private const string outputConcDir = @"C:\AsposePDF\Concatenated\";
		private const string outputDirNestedBookmarks = @"C:\AsposePDF\NestedBookmarks\";

		private const string serverDirectory = @"wwwroot\";

		// GET api/values
		//[HttpGet]
		//public ActionResult<string> Get()
		//{
		//	return "File Created";
		//}

		//// GET api/values/5
		//[HttpGet("{id}")]
		//public ActionResult<string> Get(int id)
		//{
		//	return "value";
		//}

		// POST api/values

		[HttpPost]
		[Route("CreateFile")]
		public ActionResult<Response> CreateFile([FromBody] Request request)
		{
			try
			{
				Document document = new Document();
				Page page = document.Pages.Add();

				page.Paragraphs.Add(new Aspose.Pdf.Text.TextFragment(request.filetext));
				document.Save(serverDirectory + request.filename + ".pdf");

				return new Response()
				{
					FileContent = string.Empty,
					FileName = string.IsNullOrEmpty(request.filename) ? Guid.NewGuid().ToString() + ".pdf" : request.filename + ".pdf",
					Message = "File created successfully",
					Success = true
				};
			}
			catch (Exception ex)
			{
				return new Response()
				{
					FileContent = string.Empty,
					FileName = "",
					Message = "Could not create file. " + ex.Message,
					Success = false
				};
			}
		}

		[HttpPost]
		[Route("UploadFile")]
		public ActionResult<Response> UploadFile([FromBody] Request request)
		{
			try
			{
				//System.IO.Directory.CreateDirectory(outputConcDir);

				PdfFileEditor pdfEditor = new PdfFileEditor();

				Byte[] bitmapData = Convert.FromBase64String(request.filecontent.Split(",").Last());
				System.IO.MemoryStream streamBitmap = new System.IO.MemoryStream(bitmapData);

				System.IO.FileStream outputPDF = new System.IO.FileStream(serverDirectory + request.filename, System.IO.FileMode.Create);

				pdfEditor.Concatenate(new System.IO.MemoryStream[] { streamBitmap }, outputPDF);
				outputPDF.Close();

				return new Response()
				{
					FileContent = string.Empty,
					FileName = string.Empty,
					Message = "File Uploaded successfully",
					Success = true
				};
			}
			catch(Exception ex)
			{
				return new Response()
				{
					FileContent = string.Empty,
					FileName = "",
					Message = "Could not upload file. " + ex.Message,
					Success = false
				};
			}
			
		}

		//[HttpPost]
		//[Route("Concatenate")]
		//public ActionResult<string> Concatenate([FromBody] Request request)
		//{
		//	System.IO.Directory.CreateDirectory(outputConcDir);

		//	PdfFileEditor pdfEditor = new PdfFileEditor();

		//	List<System.IO.Stream> pdfStreams = new List<System.IO.Stream>();
		//	string[] files = System.IO.Directory.GetFiles(outputDir);
		//	foreach (string file in files)
		//	{
		//		System.IO.FileStream stream = new System.IO.FileStream(file, System.IO.FileMode.Open);
		//		pdfStreams.Add(stream);
		//	}

		//	System.IO.FileStream outputPDF = new System.IO.FileStream(outputConcDir + request.filename + ".pdf", System.IO.FileMode.Create);

		//	pdfEditor.Concatenate(pdfStreams.ToArray(), outputPDF);
		//	outputPDF.Close();

		//	return "Files Concatenated Successfully";
		//}

		[HttpPost]
		[Route("ConcatenateWithContents")]
		public ActionResult<Response> ConcatenateWithContents([FromBody] Request request)
		{

			try
			{
				PdfFileEditor pdfEditor = new PdfFileEditor();

				using (MemoryStream Concatenated_Stream = new MemoryStream())
				{

					string concFilename = "Concatenated_Table_Of_Contents.pdf";

					List<System.IO.Stream> pdfStreams = new List<System.IO.Stream>();
					string[] files = System.IO.Directory.GetFiles(serverDirectory);
					foreach (string file in files)
					{
						if (file.ToLower().Contains(concFilename.ToLower())) continue;
						if (!Path.GetExtension(file).Equals(".pdf")) continue;
						System.IO.FileStream stream = new System.IO.FileStream(file, System.IO.FileMode.Open);
						pdfStreams.Add(stream);
						
					}

					//System.IO.FileStream outputPDF = new System.IO.FileStream(serverDirectory + request.filename + ".pdf", System.IO.FileMode.Create);

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
								contentEditor.CreateLocalLink(new System.Drawing.Rectangle(150, 650 - diff, 100, 20), counter + 1, 1, System.Drawing.Color.Transparent);
								counter++;
								diff += 40;
							}

							if(System.IO.File.Exists(serverDirectory + concFilename))
							{
								System.IO.File.Delete(serverDirectory + concFilename);
							}
							contentEditor.Save(serverDirectory + concFilename);
						}
					}
				}

				return new Response()
				{
					FileContent = string.Empty,
					FileName = "Concatenated_Table_Of_Contents.pdf",
					Message = "Files Concatenated successfully to: Concatenated_Table_Of_Contents.pdf file",
					Success = true
				};
			}
			catch(Exception ex)
			{
				return new Response()
				{
					FileContent = string.Empty,
					FileName = "",
					Message = "Could not concatenate files. " + ex.Message,
					Success = false
				};
			}
			
		}

		//[HttpPost]
		//[Route("CreateFileWithNB")]
		//public ActionResult<string> CreateFileWithNB([FromBody] Request request)
		//{
		//	string filename = string.IsNullOrEmpty(request.filename) ? "Nested_BookMarks_out" : request.filename;
		//	System.IO.Directory.CreateDirectory(outputDirNestedBookmarks);

		//	// New a object of Class PdfContentEditor
		//	PdfContentEditor editor = new PdfContentEditor();
		//	editor.BindPdf(outputDirNestedBookmarks + "inFile.pdf");
		//	// Creating child items of a chapter, in this example, the first child item also include a child item.
		//	Bookmark bm11 = new Bookmark();
		//	// Set the action type of BookMark
		//	bm11.Action = "GoTo";
		//	// Set the BookMark Destination page
		//	bm11.PageNumber = 3;
		//	// Set the BookMark title. 
		//	bm11.Title = "Section - 1.1.1";

		//	Bookmark bm1 = new Bookmark();
		//	bm1.Action = "GoTo";
		//	bm1.PageNumber = 2;
		//	bm1.Title = "Section - 1.1";

		//	Aspose.Pdf.Facades.Bookmarks bms1 = new Aspose.Pdf.Facades.Bookmarks();
		//	bms1.Add(bm11);
		//	bm1.ChildItems = bms1;

		//	// Creating a child item of a chapter.
		//	Bookmark bm2 = new Bookmark();
		//	bm2.Action = "GoTo";
		//	bm2.PageNumber = 4;
		//	bm2.Title = "Section - 1.2";

		//	// Creating a chapter (Parent Level Bookmark)
		//	Bookmark bm = new Bookmark();
		//	bm.Action = "GoTo";
		//	bm.PageNumber = 1;
		//	bm.Title = "Chapter - 1";

		//	Aspose.Pdf.Facades.Bookmarks bms = new Aspose.Pdf.Facades.Bookmarks();
		//	// Add the Section - 1.1, bookmark to bookmarks collection
		//	bms.Add(bm1);
		//	// Add the Section - 1.2, bookmark to bookmarks collection
		//	bms.Add(bm2);
		//	// Add the Bookmarks collection as child_Item of Chapter_Level bookmark
		//	bm.ChildItems = bms;

		//	// Creating a chapter (Parent Level Bookmark)
		//	Bookmark bm_parent2 = new Bookmark();
		//	bm_parent2.Action = "GoTo";
		//	bm_parent2.PageNumber = 5;
		//	bm_parent2.Title = "Chapter - 2";

		//	// Creating a child item of a chapter.
		//	Bookmark bm22 = new Bookmark();
		//	bm22.Action = "GoTo";
		//	bm22.PageNumber = 6;
		//	bm22.Title = "Section - 2.1";

		//	Aspose.Pdf.Facades.Bookmarks bms_parent2 = new Aspose.Pdf.Facades.Bookmarks();
		//	// Add the Section - 2.1, bookmark to bookmarks collection
		//	bms_parent2.Add(bm22);
		//	// Add the Bookmarks collection as child_Item of Chapter2_Level bookmark
		//	bm_parent2.ChildItems = bms_parent2;

		//	// Saves the result PDF to file
		//	editor.Save(outputDirNestedBookmarks + "Nested_BookMarks_out.pdf");
		//	// ExEnd:CreateNestedBookmarks   

		//	return "";
		//}

	}
}
