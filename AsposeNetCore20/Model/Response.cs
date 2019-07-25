using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AsposeNetCore20.Model
{
	public class Response
	{
		public string FileContent { get; set; }
		public string FileName { get; set; }
		public string Message { get; set; }
		public bool Success { get; set; }
	}
}
