using System;
using System.Collections.Generic;
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
