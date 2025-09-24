using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ElectiaCore.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class RemovedCollaboratingProfessors : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "CourseCollaboratingProfessors");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "CourseCollaboratingProfessors",
                columns: table => new
                {
                    CollaboratingCoursesId = table.Column<int>(type: "int", nullable: false),
                    CollaboratingProfessorsUserId = table.Column<string>(type: "nvarchar(450)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CourseCollaboratingProfessors", x => new { x.CollaboratingCoursesId, x.CollaboratingProfessorsUserId });
                    table.ForeignKey(
                        name: "FK_CourseCollaboratingProfessors_Courses_CollaboratingCoursesId",
                        column: x => x.CollaboratingCoursesId,
                        principalTable: "Courses",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_CourseCollaboratingProfessors_Professors_CollaboratingProfessorsUserId",
                        column: x => x.CollaboratingProfessorsUserId,
                        principalTable: "Professors",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_CourseCollaboratingProfessors_CollaboratingProfessorsUserId",
                table: "CourseCollaboratingProfessors",
                column: "CollaboratingProfessorsUserId");
        }
    }
}
