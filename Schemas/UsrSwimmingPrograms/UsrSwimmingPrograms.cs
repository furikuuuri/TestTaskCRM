namespace Terrasoft.Configuration
{

	using Newtonsoft.Json;
	using Newtonsoft.Json.Linq;
	using System;
	using System.Collections.Generic;
	using System.Collections.ObjectModel;
	using System.Drawing;
	using System.Globalization;
	using System.IO;
    using System.Linq;
    using Terrasoft.Common;
	using Terrasoft.Core;
	using Terrasoft.Core.Configuration;
	using Terrasoft.Core.Entities;
	using Terrasoft.Core.Process;
	using Terrasoft.Core.Process.Configuration;

	#region Class: UsrSwimmingPrograms_TestTasksEventsProcess

	public partial class UsrSwimmingPrograms_TestTasksEventsProcess<TEntity>
	{

		#region Methods: Public
		public void OnSwimmingProgramInserting()
		{
			var code = Entity.GetTypedColumnValue<string>("UsrCode");
            if (IsAnyProgramWithSameCode(code, Entity.PrimaryColumnValue))
            {
				throw new Exception($"Программа плавания с кодом  {code} уже существует");
			}
		}
		private bool IsAnyProgramWithSameCode(string code,Guid currentProgramId)
		{
			var esq = new EntitySchemaQuery(UserConnection.EntitySchemaManager, "UsrSwimmingPrograms");
			esq.AddColumn("UsrCode");
			esq.PrimaryQueryColumn.IsAlwaysSelect = true;
			esq.Filters.Add(esq.CreateFilterWithParameters(FilterComparisonType.NotEqual, "Id", currentProgramId));
			esq.Filters.Add(esq.CreateFilterWithParameters(FilterComparisonType.Equal, "UsrCode", code));
			return esq.GetEntityCollection(UserConnection).Any();
		}
		#endregion

	}

	#endregion

}

