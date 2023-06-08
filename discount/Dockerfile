FROM mcr.microsoft.com/dotnet/sdk:6.0 as build-env
WORKDIR /app

COPY *.csproj ./

# RUN dotnet tool install --global dotnet-ef --version 6.0
# ENV PATH="$PATH:/root/.dotnet/tools"
RUN dotnet restore

COPY . ./

RUN dotnet publish -c Release -o out

FROM mcr.microsoft.com/dotnet/aspnet:6.0 as runtime
WORKDIR /app
COPY --from=build-env /app/out .
EXPOSE 80
ENTRYPOINT ["dotnet", "DiscountAPI.dll"]