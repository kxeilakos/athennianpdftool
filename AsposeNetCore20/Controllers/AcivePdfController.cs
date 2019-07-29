using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AsposeNetCore20.Model;
using Microsoft.AspNetCore.Mvc;

namespace AsposeNetCore20.Controllers
{
	[Route("api/activepdf")]
	[ApiController]
	public class AcivePdfController : ControllerBase
	{
		private const string serverDirectory = @"wwwroot\";

		[HttpPost]
		[Route("CreateFile")]
		public ActionResult<Response> CreateFile([FromBody] Request request)
		{
			try
			{
				using (APToolkitNET.Toolkit toolkit = new APToolkitNET.Toolkit())
				{
					//Set page dimensions
					toolkit.OutputPageHeight = 792.0f;
					toolkit.OutputPageWidth = 612.0f;

					//Create new file
					int result = toolkit.OpenOutputFile(FileName: $"{ serverDirectory}{request.filename}.pdf");
					if (result != 0) throw new Exception($"Could not create file: {request.filename}");

					// Each time a new page is required call NewPage
					toolkit.NewPage();

					toolkit.PrintLogo();

					// Get the current version of Toolkit and save it to print on
					// the PDF
					string toolkitVersion = toolkit.ToolkitVersion;

					toolkit.SetFont(FontName: "Arial", FontSize: 24);
					toolkit.PrintText(X: 72.0f, Y: 720.0f, Text: toolkitVersion);

					toolkit.PrintText(X: 72.0f, Y: 500.0f, Text: request.filetext);

					// Images can be added onto the new page with PrintImage,
					// PrintJPEG and PrintTIFF
					toolkit.PrintJPEG(
						FileName: serverDirectory + "logoSpartanDevTeam.jpg",
						X: 72.0f,
						Y: 400.0f,
						Width: 150.0f,
						Height: 150.0f,
						PersistRatio: true,
						PageNumber: 0);

					// Copy the template (with any changes) to the new file
					// Start page and end page, 0 = all pages
					result = toolkit.CopyForm(FirstPage: 0, LastPage: 0);
					if(result != 0) throw new Exception($"Could not Copy Template to new file: {request.filename}");

					// Close the new file to complete PDF creation
					toolkit.CloseOutputFile();

					return new Response()
					{
						FileContent = string.Empty,
						FileName = string.IsNullOrEmpty(request.filename) ? Guid.NewGuid().ToString() + ".pdf" : request.filename + ".pdf",
						Message = "File created successfully",
						Success = true
					};
				}

					
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
	}
}